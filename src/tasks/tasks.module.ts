import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Task from './data/entities/tasks.entity';
import TaskLabel from './data/entities/task-labels.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Task, TaskLabel])],
	controllers: [TasksController],
	providers: [TasksService],
})
export class TasksModule {}
