import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../data/entities/tasks.entity';

export class FindTasksQuery {
	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus;

	@IsOptional()
	@MinLength(3)
	@IsString()
	search?: string;
}
