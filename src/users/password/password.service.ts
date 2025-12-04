import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
	private readonly SALT_ROUNDS = 10;

	public async hash(password: string) {
		return await bcrypt.hash(password, this.SALT_ROUNDS);
	}

	public async verify(plain: string, hashed: string) {
		return await bcrypt.compare(plain, hashed);
	}
}
