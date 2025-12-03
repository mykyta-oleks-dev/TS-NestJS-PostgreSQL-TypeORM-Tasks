import { AppConfig } from './app.config';
import Joi from 'joi';

export default interface ConfigType {
	app: AppConfig;
}

export const appConfigSchema = Joi.object({
	APP_MESSAGE_PREFIX: Joi.string().default('Hello'),
});
