import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../data/dtos/users.dto';
import User from '../data/entities/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	public async register(createUser: CreateUserDto) {
		const existingUser = await this.userService.findOneByEmail(
			createUser.email,
		);

		if (existingUser) {
			throw new ConflictException('Email already exists');
		}

		const user = await this.userService.createUser(createUser);

		return user;
	}

	public generateToken(user: User) {
		const payload = {
			sub: user.id,
			name: user.name,
		};

		return this.jwtService.sign(payload);
	}
}
