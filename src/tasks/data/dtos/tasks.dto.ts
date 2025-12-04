import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';
import { TaskStatus } from '../entities/tasks.entity';
import { CreateTaskLabelDto } from './task-labels.dto';
import { Type } from 'class-transformer';

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

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateTaskLabelDto)
	labels?: CreateTaskLabelDto[];
}

export class UpdateTaskDto extends PartialType(
	OmitType(CreateTaskDto, ['userId'] as const),
) {}

export class UpdateStatusDto {
	@IsNotEmpty()
	@IsEnum(TaskStatus)
	status: TaskStatus;
}
