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
import { AdminResponse, LoginResponse } from '../data/responses/auth.responses';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { AuthRequest } from './auth.requests';
import { Public } from '../decorators/public.decorator';
import { Role } from '../types/roles.enum';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@Post('register')
	@Public()
	public async register(@Body() body: CreateUserDto) {
		const user = await this.authService.register(body);
		return user;
	}

	@Post('login')
	@Public()
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

	@Get('admin')
	@Roles(Role.ADMIN)
	public adminOnly() {
		return new AdminResponse({ message: 'Hello World!' });
	}
}
