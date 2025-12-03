export class WrongTaskStatusException extends Error {
	constructor() {
		super('Wrong task status change!');
		this.name = 'WrongTaskStatusException';
	}
}
