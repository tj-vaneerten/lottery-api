import fastify from 'fastify';
import fastifyMongodb from 'fastify-mongodb';
import gamesRoutes from './routes/games';
import drawingsRoutes from './routes/drawings';
import timers from './plugins/timers';
import executor from './plugins/executor';
import startGames from './plugins/startGames';
import config from './config';

const app = fastify({
	logger: true,
	ignoreTrailingSlash: true
});

app.register(fastifyMongodb, {
	forceClose: true,
	url: config.MONGODB_URL
});

app.register(timers);
app.register(executor);
app.register(startGames);

app.register(gamesRoutes, { prefix: '/games' });
app.register(drawingsRoutes, { prefix: '/drawings' });

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