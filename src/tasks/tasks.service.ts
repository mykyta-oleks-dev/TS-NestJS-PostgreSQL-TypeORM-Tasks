import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTaskDto } from './task.dto';
import { ITask, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
	private readonly tasks: ITask[] = [];

	findAll(): ITask[] {
		return this.tasks;
	}

	findOne(id: string) {
		return this.tasks.find((t) => t.id === id);
	}

	create(body: CreateTaskDto): ITask {
		const task: ITask = {
			id: randomUUID(),
			...body,
		};

		this.tasks.push(task);

		return task;
	}

	updateStatus(task: ITask, status: TaskStatus): ITask {
		return {
			...task,
			status,
		};
	}
}
