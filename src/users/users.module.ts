import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AuthConfig } from '../shared/config/auth.config';
import TypedConfigService from '../shared/types/config-service.types';
import { UsersController } from './users.controller';
import User from './data/entities/users.entity';
import { PasswordService } from './password/password.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

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
	controllers: [UsersController],
	providers: [UsersService, PasswordService, AuthService],
})
export class UsersModule {}
