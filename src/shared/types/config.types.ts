import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from '../config/app.config';
import Joi from 'joi';
import { AuthConfig } from '../config/auth.config';

export default interface ConfigType {
	app: AppConfig;
	db: TypeOrmModuleOptions;
	auth: AuthConfig;
}

export const appConfigSchema = Joi.object({
	APP_MESSAGE_PREFIX: Joi.string().default('Hello'),

	DB_HOST: Joi.string().default('localhost'),
	DB_PORT: Joi.number().default(5432),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_DATABASE: Joi.string().required(),
	DB_SYNC: Joi.number().valid(0, 1).default(0),

	JWT_SECRET: Joi.string().required(),
	JWT_EXPIRES_IN: Joi.string().default('60m'),
});
