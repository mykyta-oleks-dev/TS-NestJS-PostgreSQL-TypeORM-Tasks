import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ITask } from './task.model';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

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

	update(task: ITask, body: UpdateTaskDto): ITask {
		Object.assign(task, body);

		return task;
	}

	delete(task: ITask) {
		const idx = this.tasks.findIndex((t) => t.id === task.id);
		this.tasks.splice(idx, 1);
	}
}
