import { registerAs } from '@nestjs/config';

const appConfig = registerAs('app', () => ({
	messagePrefix: process.env.APP_MESSAGE_PREFIX ?? 'Hello',
}));

export default appConfig;
