import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParams } from '../shared/search/pagination.params';
import { CreateTaskLabelDto } from './data/dtos/task-labels.dto';
import { CreateTaskDto, UpdateTaskDto } from './data/dtos/tasks.dto';
import TaskLabel from './data/entities/task-labels.entity';
import Task, { TaskStatus } from './data/entities/tasks.entity';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { FindTasksQuery } from './validation/params';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private readonly tasksRepository: Repository<Task>,

		@InjectRepository(TaskLabel)
		private readonly taskLabelsRepository: Repository<TaskLabel>,
	) {}

	// Tasks

	public async findAll(
		filters: FindTasksQuery,
		pagination: PaginationParams,
		userId: string,
	) {
		const query = this.tasksRepository
			.createQueryBuilder('task')
			.leftJoinAndSelect('task.labels', 'labels');

		query.andWhere('task.userId = :userId', { userId });

		if (filters.status) {
			query.andWhere('task.status = :status', { status: filters.status });
		}

		if (filters.search?.trim()) {
			query.andWhere(
				'(task.title ILIKE :search OR task.description ILIKE :search)',
				{ search: `%${filters.search.trim()}%` },
			);
		}

		if (filters.labels?.length) {
			const subQuery = query
				.subQuery()
				.select('labels.taskId')
				.from('task_labels', 'labels')
				.where('labels.name IN (:...names)', {
					names: filters.labels,
				})
				.getQuery();

			query.andWhere(`task.id IN ${subQuery}`);
		}

		query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

		query.skip(pagination.offset).take(pagination.limit);

		return await query.getManyAndCount();
	}

	public async findOne(id: string) {
		return await this.tasksRepository.findOne({
			where: { id },
			relations: ['labels'],
		});
	}

	public async create(body: CreateTaskDto, userId: string) {
		if (body.labels) {
			body.labels = this._getUniqueLabels(body.labels);
		}

		body.userId = userId;

		return await this.tasksRepository.save(body);
	}

	public async update(task: Task, body: UpdateTaskDto) {
		if (
			body.status &&
			!this._checkIsValidStatusChange(task.status, body.status)
		) {
			throw new WrongTaskStatusException();
		}

		if (body.labels) {
			body.labels = this._getUniqueLabels(body.labels);
		}

		Object.assign(task, body);

		return await this.tasksRepository.save(task);
	}

	public async delete(task: Task) {
		await this.tasksRepository.delete(task.id);
	}

	// TaskLabels

	public async addLabels(task: Task, labelDtos: CreateTaskLabelDto[]) {
		const existingNames = new Set(task.labels.map((l) => l.name));

		const labels = this._getUniqueLabels(labelDtos)
			.filter((l) => !existingNames.has(l.name))
			.map((l) => this.taskLabelsRepository.create(l));

		if (labels.length) {
			task.labels = [...task.labels, ...labels];
			return await this.tasksRepository.save(task);
		}

		return task;
	}

	public async removeLabels(task: Task, labelsToRemove: string[]) {
		task.labels = task.labels.filter(
			(l) => !labelsToRemove.includes(l.name),
		);
		return await this.tasksRepository.save(task);
	}

	// Helpers

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

	private _getUniqueLabels(
		labelDtos: CreateTaskLabelDto[],
	): CreateTaskLabelDto[] {
		const uniqueNames = [...new Set(labelDtos.map((l) => l.name))];
		return uniqueNames.map((n) => ({ name: n }));
	}
}
