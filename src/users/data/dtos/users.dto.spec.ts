import { validate } from 'class-validator';
import { CreateUserDto } from './users.dto';

describe('Users.DTO', () => {
	it('2+2=4', () => {
		expect(2).toBe(2);
	});

	describe('CreateUserDto', () => {
		let dto = new CreateUserDto();

		beforeEach(() => {
			dto = new CreateUserDto();

			dto.email = 'test@test.com';
			dto.name = 'Name Surname';
			dto.password = '123456A#';
		});

		it('should validate complete data', async () => {
			const errors = await validate(dto);

			expect(errors.length).toBe(0);
		});

		it('should fail on invalid email', async () => {
			dto.email = 'test@test';

			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const error = errors[0];

			expect(error.property).toBe('email');
			expect(error.constraints).toHaveProperty('isEmail');
		});

		it('should fail on invalid password length', async () => {
			dto.password = '12345';

			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const error = errors[0];

			expect(error.property).toBe('password');
			expect(error.constraints).toHaveProperty('minLength');
		});

		it('should fail on empty name', async () => {
			dto.name = '';

			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const error = errors[0];

			expect(error.property).toBe('name');
			expect(error.constraints).toHaveProperty('isNotEmpty');
		});

		it.each([
			{ password: '123456!', condition: 'uppercase letter' },
			{ password: 'ABCDEF!', condition: 'number' },
			{ password: '123456A', condition: 'special character' },
		])(
			"should fail if password doesn't contain a: $condition",
			async ({ password, condition }) => {
				dto.password = password;

				const errors = await validate(dto);

				const passwordError = errors.find(
					(e) => e.property === 'password',
				);

				expect(passwordError).toBeDefined();

				const messages = Object.values(
					passwordError?.constraints ?? {},
				);

				expect(messages).toContain(
					`password must contain at least 1 ${condition}`,
				);
			},
		);
	});
});
