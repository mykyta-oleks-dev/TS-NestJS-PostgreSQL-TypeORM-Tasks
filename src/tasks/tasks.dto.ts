import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from './tasks.entity';

export class CreateTaskDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsNotEmpty()
	@IsEnum(TaskStatus)
	status: TaskStatus;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class UpdateStatusDto {
	@IsNotEmpty()
	@IsEnum(TaskStatus)
	status: TaskStatus;
}
