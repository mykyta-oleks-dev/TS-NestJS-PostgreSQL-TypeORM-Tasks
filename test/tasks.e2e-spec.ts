import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './utils/setup';
import { CreateTaskDto } from '../src/tasks/data/dtos/tasks.dto';
import { JwtPayload } from '../src/users/types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import Task, { TaskStatus } from '../src/tasks/data/entities/tasks.entity';
import { PaginationResponse } from '../src/shared/search/pagination.response';

describe('Tasks (e2e)', () => {
	let testSetup: TestSetup;
	let accessToken = '';
	let taskId = '';

	const testUser = {
		email: 'test@example.com',
		password: 'Password123!',
		name: 'Test user',
	};

	const register = async (user: {
		email: string;
		password: string;
		name: string;
	}) => {
		await request(testSetup.app.getHttpServer())
			.post('/auth/register')
			.send(user);
	};

	const logIn = async (user: { email: string; password: string }) => {
		const loginResponse = await request(testSetup.app.getHttpServer())
			.post('/auth/login')
			.send({ email: user.email, password: user.password });

		const { accessToken: token } = loginResponse.body as {
			accessToken: string;
		};

		return token;
	};

	const createTask = async (task: CreateTaskDto, token: string) => {
		const taskCreateResponse = await request(testSetup.app.getHttpServer())
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send(task);

		const { id } = taskCreateResponse.body as Task;

		return id;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const getJwtPayload = (token: string) => {
		return testSetup.app.get(JwtService).decode<JwtPayload>(token);
	};

	beforeEach(async () => {
		testSetup = await TestSetup.create(AppModule);

		await register(testUser);

		const token = await logIn(testUser);

		accessToken = token;

		const id = await createTask(
			{
				title: 'Test task',
				description: 'Test task description',
				status: TaskStatus.OPEN,
				labels: [{ name: 'test' }],
			},
			accessToken,
		);

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

	it("should not allow access to other users' tasks", async () => {
		const otherUser = { ...testUser, email: 'other@example.com' };

		await register(otherUser);

		const token = await logIn(otherUser);

		await request(testSetup.app.getHttpServer())
			.get(`/tasks/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(403);
	});

	it("should list only current user's tasks", async () => {
		const otherUser = { ...testUser, email: 'other@example.com' };

		await register(otherUser);

		const otherUserToken = await logIn(otherUser);

		const otherUserTask = {
			title: 'Other user task',
			description: 'Other user task description',
			status: TaskStatus.OPEN,
			labels: [{ name: 'other' }],
		};

		await createTask(otherUserTask, otherUserToken);

		await request(testSetup.app.getHttpServer())
			.get(`/tasks`)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)
			.expect((res) => {
				const body = res.body as PaginationResponse<Task>;

				expect(body.data).not.toContainEqual(otherUserTask);

				const { sub } = getJwtPayload(accessToken);

				body.data.forEach((task) => {
					expect(task).toHaveProperty('userId', sub);
				});
			});
	});
});
