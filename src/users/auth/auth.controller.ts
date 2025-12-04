import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../data/dtos/users.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../data/dtos/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	public async register(@Body() body: CreateUserDto) {
		return await this.authService.register(body);
	}

	@Post('login')
	public async login(@Body() body: LoginDto) {
		const accessToken = await this.authService.login(body);

		return { accessToken };
	}
}
