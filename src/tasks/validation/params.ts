import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../data/entities/tasks.entity';

export class FindTasksQuery {
	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus;
}
