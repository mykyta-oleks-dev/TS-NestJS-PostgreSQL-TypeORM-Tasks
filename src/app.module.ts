import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { MessageFormatter } from './message-formatter/message-formatter';
import appConfig from './shared/config/app.config';
import typeOrmConfig from './shared/config/db.config';
import TypedConfigService from './shared/types/config-service.types';
import { appConfigSchema } from './shared/types/config.types';
import { TasksModule } from './tasks/tasks.module';
import Task from './tasks/tasks.entity';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: TypedConfigService) => ({
				...(await configService.get('db')),
				entities: [Task],
			}),
		}),
		ConfigModule.forRoot({
			load: [appConfig, typeOrmConfig],
			validationSchema: appConfigSchema,
			validationOptions: {
				allowUnknown: true,
				abortEarly: true,
			},
		}),
		TasksModule,
	],

	controllers: [AppController],
	providers: [
		AppService,
		DummyService,
		MessageFormatter,
		LoggerService,
		{
			provide: TypedConfigService,
			useExisting: ConfigService,
		},
	],
})
export class AppModule {}
