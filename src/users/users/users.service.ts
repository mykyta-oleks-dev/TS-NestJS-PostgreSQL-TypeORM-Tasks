import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../data/entities/users.entity';
import { Repository } from 'typeorm';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from '../data/dtos/users.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly passwordService: PasswordService,
	) {}

	public async findOneByEmail(email: string) {
		return await this.usersRepository.findOneBy({ email });
	}

	public async createUser(body: CreateUserDto) {
		const password = await this.passwordService.hash(body.password);

		const user = this.usersRepository.create({
			...body,
			password,
		});

		return await this.usersRepository.save(user);
	}

	public async findOne(id: string) {
		return await this.usersRepository.findOneBy({ id });
	}
}
