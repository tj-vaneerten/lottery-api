import fastify from 'fastify';
import fastifyMongodb from 'fastify-mongodb';

const app = fastify({
	logger: true,
	ignoreTrailingSlash: true
});

app.register(fastifyMongodb, {
	forceClose: true,
	url: 'mongodb://localhost:27017/test'
});

app.get('/games', (request, reply) => {
	reply.send([]);
});

const start = (opts, callback) => {
	app.listen(opts.port, opts.address, err => {
		callback(err, app);
	});
}

if (require.main === module) {
	start({
		address: '0.0.0.0',
		port: 3000
	}, err => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
	});
}

export default start;