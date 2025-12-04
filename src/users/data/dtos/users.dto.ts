import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@Matches(/[A-Z]/, {
		message: 'password must contain at least 1 uppercase letter',
	})
	@Matches(/\d/, {
		message: 'password must contain at least 1 number',
	})
	@Matches(/[^A-Za-z0-9]/, {
		message: 'password must contain at least 1 special character',
	})
	password: string;
}
