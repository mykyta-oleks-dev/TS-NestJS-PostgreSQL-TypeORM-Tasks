import { Injectable } from '@nestjs/common';
import { MessageFormatter } from '../message-formatter/message-formatter';

@Injectable()
export class LoggerService {
	constructor(private readonly messageFormatter: MessageFormatter) {}

	public log(message: string) {
		const formattedMessage = this.messageFormatter.format(message);

		console.log(formattedMessage);

		return formattedMessage;
	}
}
