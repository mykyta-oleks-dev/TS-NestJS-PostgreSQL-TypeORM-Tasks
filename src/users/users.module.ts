import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AuthConfig } from '../shared/config/auth.config';
import TypedConfigService from '../shared/types/config-service.types';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import User from './data/entities/users.entity';
import { PasswordService } from './password/password.service';
import { UsersService } from './users/users.service';
import { AuthGuard } from './auth/guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: TypedConfigService) => ({
				secret: config.get<AuthConfig>('auth')?.jwt.secret,
				signOptions: {
					expiresIn: config.get<AuthConfig>('auth')?.jwt
						.expiresIn as StringValue,
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [UsersService, PasswordService, AuthService, AuthGuard],
})
export class UsersModule {}
