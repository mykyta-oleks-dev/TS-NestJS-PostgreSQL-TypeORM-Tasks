import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/setup';

describe('AppController (e2e)', () => {
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
});
