import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig = registerAs(
	'db',
	(): TypeOrmModuleOptions => ({
		type: 'postgres',
		host: process.env.DB_HOST,
		port: Number.parseInt(process.env.DB_PORT ?? '5432'),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		synchronize: Boolean(process.env.DB_SYNC ?? false),
	}),
);

export default typeOrmConfig;
