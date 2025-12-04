import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import Task from './tasks.entity';

@Entity('task_labels')
@Unique(['name', 'taskId'])
export default class TaskLabel {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({
		type: 'varchar',
		length: 100,
		nullable: false,
	})
	name: string;

	@Column()
	@Index()
	taskId: string;

	@ManyToOne(() => Task, (task) => task.labels, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	task: Task;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
