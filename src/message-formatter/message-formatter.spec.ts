import { Test, TestingModule } from '@nestjs/testing';
import { MessageFormatter } from './message-formatter';

describe('MessageFormatter', () => {
	let provider: MessageFormatter;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MessageFormatter],
		}).compile();

		provider = module.get<MessageFormatter>(MessageFormatter);
	});

	it('should be defined', () => {
		expect(provider).toBeDefined();
	});
});
