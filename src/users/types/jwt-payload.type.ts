import { Role } from './roles.enum';

export interface JwtPayload {
	sub: string;
	name: string;
	roles: Role[];
}
