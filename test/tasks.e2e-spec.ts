import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './utils/setup';
import { CreateTaskDto } from '../src/tasks/data/dtos/tasks.dto';
import { JwtPayload } from '../src/users/types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import Task, { TaskStatus } from '../src/tasks/data/entities/tasks.entity';

describe('Tasks (e2e)', () => {
	let testSetup: TestSetup;
	let accessToken = '';
	let taskId = '';

	const testUser = {
		email: 'test@example.com',
		password: 'Password123!',
		name: 'Test user',
	};

	beforeEach(async () => {
		testSetup = await TestSetup.create(AppModule);

		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(testUser);

		const loginResponse = await request(testSetup.app.getHttpServer())
			.post('/auth/login')
			.send({ email: testUser.email, password: testUser.password });

		const { accessToken: token } = loginResponse.body as {
			accessToken: string;
		};

		accessToken = token;

		const decoded = testSetup.app
			.get(JwtService)
			.decode<JwtPayload>(accessToken);

		const taskCreateResponse = await request(testSetup.app.getHttpServer())
			.post('/tasks')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'Test task',
				description: 'Test task description',
				status: TaskStatus.OPEN,
				labels: [{ name: 'test' }],
				userId: decoded.sub,
			} as CreateTaskDto);

		const { id } = taskCreateResponse.body as Task;
		taskId = id;
	}, 15000);

	afterEach(async () => {
		await testSetup?.cleanup();
	});

	afterAll(async () => {
		await testSetup?.teardown();
	});

	it('should have created and set taskId', () => {
		expect(taskId.length).toBeGreaterThan(0);
	});
});
