import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { appConfigSchema } from './config/config.types';
import typeOrmConfig from './config/db.config';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { MessageFormatter } from './message-formatter/message-formatter';
import { TasksModule } from './tasks/tasks.module';

@Module({
	imports: [
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
	providers: [AppService, DummyService, MessageFormatter, LoggerService],
})
export class AppModule {}
