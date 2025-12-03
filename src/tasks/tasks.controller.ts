import {
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
import { FindOneParams } from '../shared/find-one.params';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	public findAll() {
		return this.tasksService.findAll();
	}

	@Get(':id')
	public findOne(@Param() { id }: FindOneParams) {
		return this._findOneOrFail(id);
	}

	@Post()
	public create(@Body() body: CreateTaskDto) {
		return this.tasksService.create(body);
	}

	@Patch(':id/status')
	public updateStatus(
		@Param() { id }: FindOneParams,
		@Body() { status }: UpdateTaskDto,
	) {
		const task = this._findOneOrFail(id);
		return this.tasksService.updateStatus(task, status);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	public delete(@Param() { id }: FindOneParams) {
		const task = this._findOneOrFail(id);
		this.tasksService.delete(task);
	}

	private _findOneOrFail(id: string) {
		const task = this.tasksService.findOne(id);

		if (task) return task;

		throw new NotFoundException();
	}
}
