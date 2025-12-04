import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { PaginationParams } from '../shared/search/pagination.params';
import type { PaginationResponse } from '../shared/search/pagination.response';
import { FindOneParams } from '../shared/validation/params';
import { CurrentUserId } from '../users/decorators/current-user-id.decorator';
import { CreateTaskLabelDto } from './data/dtos/task-labels.dto';
import { CreateTaskDto, UpdateTaskDto } from './data/dtos/tasks.dto';
import Task from './data/entities/tasks.entity';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { TasksService } from './tasks.service';
import { FindTasksQuery } from './validation/params';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	public async findAll(
		@Query() pagination: PaginationParams,
		@Query() filters: FindTasksQuery,
	) {
		const [items, count] = await this.tasksService.findAll(
			filters,
			pagination,
		);

		const response: PaginationResponse<Task> = {
			meta: {
				...pagination,
				total: count,
			},
			data: items,
		};

		return response;
	}

	@Get(':id')
	public async findOne(@Param() { id }: FindOneParams) {
		return await this._findOneOrFail(id);
	}

	@Post()
	public async create(
		@Body() body: CreateTaskDto,
		@CurrentUserId() id: string,
	) {
		return await this.tasksService.create(body, id);
	}

	@Patch(':id')
	public async update(
		@Param() { id }: FindOneParams,
		@Body() body: UpdateTaskDto,
	) {
		const task = await this._findOneOrFail(id);
		try {
			return await this.tasksService.update(task, body);
		} catch (err) {
			if (err instanceof WrongTaskStatusException) {
				throw new BadRequestException([err.message]);
			} else throw err;
		}
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	public async delete(@Param() { id }: FindOneParams) {
		const task = await this._findOneOrFail(id);
		await this.tasksService.delete(task);
	}

	private async _findOneOrFail(id: string) {
		const task = await this.tasksService.findOne(id);

		if (task) return task;

		throw new NotFoundException();
	}

	// TaskLabels

	@Post(':id/labels')
	public async addLabels(
		@Param() { id }: FindOneParams,
		@Body() labels: CreateTaskLabelDto[],
	) {
		const task = await this._findOneOrFail(id);
		return await this.tasksService.addLabels(task, labels);
	}

	@Delete(':id/labels')
	@HttpCode(HttpStatus.NO_CONTENT)
	public async removeLabels(
		@Param() { id }: FindOneParams,
		@Body() labels: string[],
	) {
		const task = await this._findOneOrFail(id);
		await this.tasksService.removeLabels(task, labels);
	}
}
