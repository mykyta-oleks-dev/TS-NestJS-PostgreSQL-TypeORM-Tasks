export class MessageFormatter {
	public format(message: string): string {
		const now = new Date();

		return `[${now.toLocaleString()}] ${message}`;
	}
}
