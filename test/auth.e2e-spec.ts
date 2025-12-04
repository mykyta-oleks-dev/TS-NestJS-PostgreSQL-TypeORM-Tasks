import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../src/users/data/entities/users.entity';
import { Repository } from 'typeorm';
import { Role } from '../src/users/types/roles.enum';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../src/users/types/jwt-payload.type';

describe('Authentication & Authorization (e2e)', () => {
	let testSetup: TestSetup;

	beforeEach(async () => {
		testSetup = await TestSetup.create(AppModule);
	}, 15000);

	afterEach(async () => {
		await testSetup?.cleanup();
	});

	afterAll(async () => {
		await testSetup?.teardown();
	});

	const testUser = {
		email: 'test@example.com',
		password: 'Password123!',
		name: 'Test user',
	};

	it('should require auth', async () => {
		return await request(testSetup.app.getHttpServer())
			.get('/tasks')
			.expect(401);
	});

	it('should allow public access', async () => {
		return request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser)
			.expect(201);
	});

	it('should include roles into JWT', async () => {
		const userRepo = testSetup.app.get<Repository<User>>(
			getRepositoryToken(User),
		);

		await userRepo.save({
			...testUser,
			roles: [Role.ADMIN],
			password: await testSetup.app
				.get(PasswordService)
				.hash(testUser.password),
		});

		const response = await request(testSetup.app.getHttpServer())
			.post('/auth/login')
			.send({ email: testUser.email, password: testUser.password });

		const decoded = testSetup.app
			.get(JwtService)
			.decode<JwtPayload>(
				(response.body as { accessToken: string }).accessToken,
			);

		expect(decoded).toHaveProperty('roles');
		expect(decoded.roles).toContain(Role.ADMIN);
	});

	it('/auth/register (POST)', () => {
		return request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser)
			.expect(201)
			.expect((res) => {
				const body = res.body as {
					email?: string;
					name?: string;
				};
				expect(body.email).toBe(testUser.email);
				expect(body.name).toBe(testUser.name);
				expect(body).not.toHaveProperty('password');
			});
	});

	it('/auth/register/ (POST) - duplicate email', async () => {
		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser);

		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser)
			.expect(409);
	});

	it('/auth/login/ (POST)', async () => {
		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser);

		const response = await request(testSetup.app.getHttpServer())
			.post('/auth/login')
			.send({ email: testUser.email, password: testUser.password });

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('accessToken');
	});

	it('/auth/profile/ (GET)', async () => {
		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser);

		const response = await request(testSetup.app.getHttpServer())
			.post('/auth/login')
			.send({ email: testUser.email, password: testUser.password });

		const { accessToken } = response.body as { accessToken: string };

		return await request(testSetup.app.getHttpServer())
			.get('/auth/profile')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)
			.expect((res) => {
				const body = res.body as {
					email?: string;
					name?: string;
				};
				expect(body.email).toBe(testUser.email);
				expect(body.name).toBe(testUser.name);
				expect(body).not.toHaveProperty('password');
			});
	});

	it('/auth/profile/ (GET) - unauthorized', async () => {
		return await request(testSetup.app.getHttpServer())
			.get('/auth/profile')
			.expect(401);
	});

	it('/auth/admin', async () => {
		const userRepo = testSetup.app.get<Repository<User>>(
			getRepositoryToken(User),
		);

		await userRepo.save({
			...testUser,
			roles: [Role.ADMIN],
			password: await testSetup.app
				.get(PasswordService)
				.hash(testUser.password),
		});

		const response = await request(testSetup.app.getHttpServer())
			.post('/auth/login')
			.send({ email: testUser.email, password: testUser.password });

		const { accessToken } = response.body as { accessToken: string };

		return await request(testSetup.app.getHttpServer())
			.get('/auth/admin')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)
			.expect((res) => {
				const { message } = res.body as { message: string };
				expect(message).toBe('Hello World!');
			});
	});

	it('/auth/admin - forbidden to access by regular users', async () => {
		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser);

		const response = await request(testSetup.app.getHttpServer())
			.post('/auth/login')
			.send({ email: testUser.email, password: testUser.password });

		const { accessToken } = response.body as { accessToken: string };

		return await request(testSetup.app.getHttpServer())
			.get('/auth/admin')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(403);
	});

	it('/auth/admin', async () => {
		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send({ ...testUser, roles: [Role.ADMIN] })
			.expect(201)
			.expect((res) => {
				const user = res.body as User;

				expect(user.roles).toEqual([Role.USER]);
			});
	});
});
