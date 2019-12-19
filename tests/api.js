import tap from 'tap';
import clean from 'mongo-clean';
import startApp from '../src/server';

startApp({
	address: 'localhost',
	port: 3000
}, (err, app) => {
	tap.error(err);
	
	tap.beforeEach(() => clean(app.mongo.db));
	tap.tearDown(() => app.close());

// --------------------------------------------------

	tap.test('GET /winners', t => {
		app.inject({
			method: 'GET',
			url: '/winners'
		})
		.then(response => {
			//t.strictEqual(response.statusCode, 200);
		})
		.catch(error => t.error(error))
		.finally(() => t.end());
	});

// --------------------------------------------------

	tap.test('GET /games', t => {

		app.inject({
			method: 'GET',
			url: '/games'
		})
		.then(response => {
			t.strictEqual(response.statusCode, 200);
			const body = JSON.parse(response.body);
			t.type(body, Array);
		})
		.catch(error => t.error(error))
		.finally(() => t.end());

	});

// --------------------------------------------------

	tap.test('GET /games/{gameId}', t => {
		app.inject({
			method: 'GET',
			url: '/games'
		})
		.then(response => {
			//t.strictEqual(response.statusCode, 200);
		})
		.catch(error => t.error(error))
		.finally(() => t.end());
	});

// --------------------------------------------------

	tap.test('GET /drawings/{drawingId}', t => {
		app.inject({
			method: 'GET',
			url: '/games'
		})
		.then(response => {
			//t.strictEqual(response.statusCode, 200);
		})
		.catch(error => t.error(error))
		.finally(() => t.end());
	});

// --------------------------------------------------

	tap.test('POST /drawings/{drawingId}/entries', t => {
		app.inject({
			method: 'GET',
			url: '/games'
		})
		.then(response => {
			//t.strictEqual(response.statusCode, 201);
		})
		.catch(error => t.error(error))
		.finally(() => t.end());
	});

});