export const testConfig = {
	db: {
		type: 'postgres',
		host: 'localhost',
		port: '5432',
		username: 'postgres',
		password: 'password',
		database: 'tasks_e2e',
		synchronize: true,
	},
	app: {
		messagePrefix: 'Test',
	},
	auth: {
		jwt: {
			secret: 'secret-123',
			expiresIn: '1m',
		},
	},
};
