import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
	constructor(
		private readonly dummyService: DummyService,
		private readonly loggerService: LoggerService,
		private readonly configService: ConfigService,
	) {}

	getHello(): string {
		const prefix = this.configService.get<string>('app.messagePrefix');
		const value = `${prefix} Hello World! ${this.dummyService.work()}`;

		return this.loggerService.log(value);
	}
}
