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
} from '@nestjs/common';
import { FindOneParams } from '../shared/validation/find-one.params';
import { CreateTaskDto, UpdateTaskDto } from './data/dtos/tasks.dto';
import { TasksService } from './tasks.service';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	public async findAll() {
		return await this.tasksService.findAll();
	}

	@Get(':id')
	public async findOne(@Param() { id }: FindOneParams) {
		return await this._findOneOrFail(id);
	}

	@Post()
	public async create(@Body() body: CreateTaskDto) {
		return await this.tasksService.create(body);
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
}
