import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../data/entities/tasks.entity';
import { Transform } from 'class-transformer';

export class FindTasksQuery {
	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus;

	@IsOptional()
	@MinLength(3)
	@IsString()
	search?: string;

	@IsOptional()
	@Transform(({ value }: { value?: string }) => {
		if (!value) return undefined;

		return value
			.split(',')
			.map((l) => l.trim())
			.filter((l) => l.length);
	})
	labels?: string[];
}
