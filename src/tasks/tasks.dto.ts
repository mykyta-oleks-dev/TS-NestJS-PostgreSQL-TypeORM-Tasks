import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
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

	@IsNotEmpty()
	@IsUUID()
	userId: string;
}

export class UpdateTaskDto extends PartialType(
	OmitType(CreateTaskDto, ['userId'] as const),
) {}

export class UpdateStatusDto {
	@IsNotEmpty()
	@IsEnum(TaskStatus)
	status: TaskStatus;
}
