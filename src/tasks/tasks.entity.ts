import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
	OPEN = 'OPEN',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE',
}

@Entity()
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
}
