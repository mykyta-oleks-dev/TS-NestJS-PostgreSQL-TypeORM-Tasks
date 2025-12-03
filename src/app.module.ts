import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { MessageFormatter } from './message-formatter/message-formatter';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule.forRoot({ load: [appConfig] }), TasksModule],
	controllers: [AppController],
	providers: [AppService, DummyService, MessageFormatter, LoggerService],
})
export class AppModule {}
