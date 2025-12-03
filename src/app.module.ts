import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { MessageFormatter } from './message-formatter/message-formatter';
import { LoggerService } from './logger/logger.service';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, DummyService, MessageFormatter, LoggerService],
})
export class AppModule {}
