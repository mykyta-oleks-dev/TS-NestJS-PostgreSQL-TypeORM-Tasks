import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Task from '../tasks/data/entities/tasks.entity';

@Entity('users')
export default class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'varchar',
		length: 100,
		nullable: false,
	})
	name: string;

	@Column({
		type: 'varchar',
		length: 100,
		nullable: false,
	})
	email: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Task, (task) => task.user)
	tasks: Task[];
}
