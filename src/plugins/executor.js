import fp from 'fastify-plugin';
import moment from 'moment';

const executor = (fastify, opts, done) => {

	const {db} = fastify.mongo;

	const getEntries = () => {
		const entries = db.collection('entries');
		return entries.find({}).toArray();
	};

	const updateTimestamps = game => {
		const games = db.collection('games');
		const next = moment().add(game.interval, 'ms');
		games.findOne({_id: game._id})
		.then(game => {
			const updatedGame = Object.assign({}, game, {
				lastDrawingTime: moment().format(),
				nextDrawingTime: next.format()
			});
			games.updateOne(game, {$set: updatedGame})
			.then(result => {});
		})
		.catch(error => console.log(error));
	};

	const execute = game => {
		// Setting up game --

		game.gameFn = () => {
			console.log(`${game._id} drawing`);
			return [1, 2, 3, 4, 5];
		};
		game.winnerFn = (result, entry) => true;

		// -------------------

		updateTimestamps(game);
		const {gameFn, winnerFilterFn} = game;
		const result = gameFn();
		return getEntries().then(entries => 
			entries.filter(entry => winnerFilterFn(entry, result)));
	};

	fastify.decorate('executor', {execute});

	done();
};

export default fp(executor);