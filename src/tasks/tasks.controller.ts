import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	public findAll() {
		return this.tasksService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string) {
		return this.tasksService.findOne(id);
	}

	@Post()
	public create(@Body() body: CreateTaskDto) {
		return this.tasksService.create(body);
	}
}
