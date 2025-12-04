import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Task from '../../../tasks/data/entities/tasks.entity';
import { Expose } from 'class-transformer';
import { Role } from '../../types/roles.enum';

@Entity('users')
export default class User {
	@PrimaryGeneratedColumn('uuid')
	@Expose()
	id: string;

	@Column({
		type: 'varchar',
		length: 100,
		nullable: false,
	})
	@Expose()
	name: string;

	@Column({
		type: 'varchar',
		length: 100,
		nullable: false,
	})
	@Expose()
	email: string;

	@Column()
	password: string;

	@CreateDateColumn()
	@Expose()
	createdAt: Date;

	@UpdateDateColumn()
	@Expose()
	updatedAt: Date;

	@OneToMany(() => Task, (task) => task.user)
	@Expose()
	tasks: Task[];

	@Column('text', { array: true, default: [Role.USER] })
	@Expose()
	roles: Role[];
}
