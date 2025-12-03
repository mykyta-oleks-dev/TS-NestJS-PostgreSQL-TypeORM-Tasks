import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ITask, TaskStatus } from './task.model';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

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
		if (
			body.status &&
			!this._checkIsValidStatusChange(task.status, body.status)
		) {
			throw new WrongTaskStatusException();
		}

		Object.assign(task, body);

		return task;
	}

	private _checkIsValidStatusChange(
		current: TaskStatus,
		updated: TaskStatus,
	): boolean {
		const statusOrder = [
			TaskStatus.OPEN,
			TaskStatus.IN_PROGRESS,
			TaskStatus.DONE,
		];

		return statusOrder.indexOf(current) <= statusOrder.indexOf(updated);
	}

	delete(task: ITask) {
		const idx = this.tasks.findIndex((t) => t.id === task.id);
		this.tasks.splice(idx, 1);
	}
}
