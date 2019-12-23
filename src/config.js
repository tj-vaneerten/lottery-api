const config = {
	dev: {
		MONGODB_URL: 'mongodb://localhost:27017/dev'
	},

	test: {
		MONGODB_URL: 'mongodb://localhost:27017/test'
	},

	prod: {
		MONGODB_URL: 'mongodb://localhost:27017/prod'
	}
};

export default config[process.env.NODE_ENV || 'dev'];