import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Task from './tasks.entity';

@Entity('task_labels')
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
	taskId: string;

	@ManyToOne(() => Task, (task) => task.labels, { nullable: false })
	task: Task;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
