import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import Task, { TaskStatus } from './data/entities/tasks.entity';
import { CreateTaskDto, UpdateTaskDto } from './data/dtos/tasks.dto';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private readonly tasksRepository: Repository<Task>,
	) {}

	async findAll() {
		return await this.tasksRepository.find();
	}

	async findOne(id: string) {
		return await this.tasksRepository.findOneBy({ id });
	}

	async create(body: CreateTaskDto) {
		console.log(body);
		return await this.tasksRepository.save(body);
	}

	async update(task: Task, body: UpdateTaskDto) {
		if (
			body.status &&
			!this._checkIsValidStatusChange(task.status, body.status)
		) {
			throw new WrongTaskStatusException();
		}

		Object.assign(task, body);

		return await this.tasksRepository.save(task);
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

	async delete(task: Task) {
		await this.tasksRepository.delete(task);
	}
}
