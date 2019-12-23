import moment from 'moment';

export default (fastify, opts, done) => {

	const {db} = fastify.mongo, games = db.collection('games');
	const {execute} = fastify.executor;

	games.find({})
	.toArray()
	.then(games => {
		games.forEach(game => {

			const now = moment();

			if (game.nextDrawingTime) {
				const next = moment(game.nextDrawingTime);

				if (next.isSameOrBefore(now)) {

					// run now, next scheduled has passed
					fastify.timers.start(game._id, () => {
						execute(game);
					}, {
						interval: game.interval,
						next: 0
					});

				} else {

					// run at previously scheduled time
					const durationToNext = moment.duration(next.diff(moment()));
					fastify.timers.start(game._id, () => {
						execute(game);
					}, {
						interval: game.interval,
						next: durationToNext
					});

				}
			} else if (game.lastDrawingTime) {
				const last = moment(game.lastDrawingTime);
				const next = last.add(game.interval, 'ms')

				if (next.isSameOrBefore(now)) {

					// run now, interval has already passed since last
					fastify.timers.start(game._id, () => {
						execute(game);
					}, {
						interval: game.interval,
						next: 0
					});

				} else {
					fastify.timers.start(game._id, () => {
						execute(game);
					}, {
						interval: game.interval,
						next: next
					});
				}
			} else {
				
				fastify.timers.start(game._id, () => {
					execute(game);
				}, {
					interval: game.interval
				});

			}

		});
	});

	done();
}