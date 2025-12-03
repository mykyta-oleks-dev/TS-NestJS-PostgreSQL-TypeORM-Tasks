import { registerAs } from '@nestjs/config';

export interface AppConfig {
	messagePrefix: string;
}

const appConfig = registerAs(
	'app',
	(): AppConfig => ({
		messagePrefix: process.env.APP_MESSAGE_PREFIX ?? 'Hello',
	}),
);

export default appConfig;
