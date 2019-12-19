import tap from 'tap';
import clean from 'mongo-clean';
import startApp from '../src/server';

const gamePattern = {
	id: /^[a-zA-Z0-9_]+$/,
	interval: Number,
	description: String,
	lastDrawingTime: Date,
	nextDrawingTime: Date
}

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
		const db = app.mongo.db;
		const games = db.collection('games');

		// insert two games and test that they return
		games.insert([
			{ _id: 'powerball', name: 'PowerBall', description: 'Powerball drawing', interval: 3600 },
			{ _id: 'megamillions', name: 'Mega Millions', description: 'Mega Millions drawing', interval: 1800 }
		])
		.then(() => app.inject({
			method: 'GET',
			url: '/games'
		}))
		.then(response => {
			t.strictEqual(response.statusCode, 200);

			const body = JSON.parse(response.body);
			t.type(body, Array);
			t.strictEqual(body.length, 2);

			const game = body[0];
			t.match(game, gamePattern);
		})
		.catch(error => t.error(error))
		.finally(() => t.end());

	});

// --------------------------------------------------

	tap.test('GET /games/{gameId}', t => {
		const db = app.mongo.db;
		const games = db.collection('games');

		// insert two games and get one by id
		games.insert([
			{ _id: 'powerball', name: 'PowerBall', description: 'Powerball drawing', interval: 3600 },
			{ _id: 'megamillions', name: 'Mega Millions', description: 'Mega Millions drawing', interval: 1800 }
		])
		.then(() => app.inject({
			method: 'GET',
			url: '/games/powerball'
		}))
		.then(response => {
			t.strictEqual(response.statusCode, 200);

			const body = JSON.parse(response.body);
			t.type(body, Object);
			t.hasStrict(body, {
				game: Object,
				pastDrawings: Array
			});
			t.match(body.game, gamePattern);
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