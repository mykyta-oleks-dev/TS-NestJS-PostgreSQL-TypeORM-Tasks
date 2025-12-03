import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../users/users.entity';

export enum TaskStatus {
	OPEN = 'OPEN',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE',
}

@Entity('tasks')
export default class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'varchar',
		length: 100,
		nullable: false,
	})
	title: string;

	@Column({
		type: 'text',
		nullable: false,
	})
	description: string;

	@Column({
		type: 'enum',
		enum: TaskStatus,
		default: TaskStatus.OPEN,
		nullable: false,
	})
	status: TaskStatus;

	@Column()
	userId: string;

	@ManyToOne(() => User, (user) => user.tasks, { nullable: false })
	user: User;
}
