import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	NotFoundException,
	Post,
	Request,
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from '../data/dtos/auth.dto';
import { CreateUserDto } from '../data/dtos/users.dto';
import { LoginResponse } from '../data/responses/auth';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { AuthRequest } from './request';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@Post('register')
	public async register(@Body() body: CreateUserDto) {
		const user = await this.authService.register(body);
		return user;
	}

	@Post('login')
	public async login(@Body() body: LoginDto) {
		const accessToken = await this.authService.login(body);

		return new LoginResponse({ accessToken });
	}

	@Get('profile')
	public async profile(@Request() req: AuthRequest) {
		const user = await this.usersService.findOne(req.user.sub);

		if (!user) {
			throw new NotFoundException();
		}

		return user;
	}
}
