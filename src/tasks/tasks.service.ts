import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
	private readonly tasks: ITask[] = [];

	findAll(): ITask[] {
		return this.tasks;
	}

	findOne(id: string): ITask {
		const task = this.tasks.find((t) => t.id === id);

		if (task) return task;

		throw new NotFoundException();
	}

	create(body: CreateTaskDto): ITask {
		const task: ITask = {
			id: randomUUID(),
			...body,
		};

		this.tasks.push(task);

		return task;
	}
}
