import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { TaskStatus } from '../entities/tasks.entity';
import { CreateTaskLabelDto } from './task-labels.dto';

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

	userId?: string;

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
