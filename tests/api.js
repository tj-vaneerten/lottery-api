import tap from 'tap';
import startApp from '../src/server';

startApp({
	address: 'localhost',
	port: 3000
}, (err, app) => {
	tap.tearDown(() => app.close());

	tap.error(err);
});