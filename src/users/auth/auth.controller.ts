import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../data/dtos/users.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../data/dtos/auth.dto';
import { LoginResponse } from '../data/responses/auth';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
}
