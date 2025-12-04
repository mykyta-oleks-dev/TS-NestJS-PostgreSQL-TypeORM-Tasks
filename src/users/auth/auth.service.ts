import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../data/dtos/users.dto';
import User from '../data/entities/users.entity';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly passwordService: PasswordService,
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

	public async login(email: string, password: string) {
		const user = await this.userService.findOneByEmail(email);

		if (
			!user ||
			!(await this.passwordService.verify(password, user.password))
		) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return this.generateToken(user);
	}

	public generateToken(user: User) {
		const payload = {
			sub: user.id,
			name: user.name,
		};

		return this.jwtService.sign(payload);
	}
}
