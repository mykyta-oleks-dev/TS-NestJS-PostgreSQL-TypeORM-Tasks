import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	NotFoundException,
	Post,
	Request,
	SerializeOptions,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../data/dtos/users.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../data/dtos/auth.dto';
import { LoginResponse } from '../data/responses/auth';
import type { AuthRequest } from './request';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './guard';

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
	@UseGuards(AuthGuard)
	public async profile(@Request() req: AuthRequest) {
		const user = await this.usersService.findOne(req.user.sub);

		if (!user) {
			throw new NotFoundException();
		}

		return user;
	}
}
