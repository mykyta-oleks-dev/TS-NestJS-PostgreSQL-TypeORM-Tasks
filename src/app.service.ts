import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
// import { LoggerService } from './logger/logger.service';
import { AppConfig } from './shared/config/app.config';
import TypedConfigService from './shared/types/config-service.types';
import { MessageFormatter } from './message-formatter/message-formatter';

@Injectable()
export class AppService {
	constructor(
		private readonly dummyService: DummyService,
		// private readonly loggerService: LoggerService,
		private readonly messageFormatter: MessageFormatter,
		private readonly configService: TypedConfigService,
	) {}

	getHello(): string {
		const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
		const value = `${prefix} Hello World! ${this.dummyService.work()}`;

		// return this.loggerService.log(value);
		return this.messageFormatter.format(value);
	}
}
