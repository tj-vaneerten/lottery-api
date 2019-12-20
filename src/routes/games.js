import gameSchema from '../schemas/game';
import drawingSchema from '../schemas/drawing';
import entrySchema from '../schemas/entry';

export default (fastify, opts, done) => {

	fastify.addSchema(gameSchema);
	fastify.addSchema(entrySchema);
	fastify.addSchema(drawingSchema);


	fastify.get('/', {
		schema: {
			response: {
				200: {
					type: 'array',
					items: 'game#'
				}
			}
		}
	}, function (request, reply) {
		const {db} = this.mongo; const games = db.collection('games');
		games.find({})
		.toArray()
		.then(results => {
			const games = results.map(result => ({
				id: result._id,
				interval: result.interval,
				description: result.description
			}));
			reply.send(games);
		})
		.catch(error => {
			console.log(error);
			reply.code(500).send({errors: [error]});
		});
	});


	fastify.post('/', {
		schema: {
			body: {
				allOf: [
					'game#',
					{ required: ['id', 'name', 'description', 'interval'] }
				]
			},
			response: {
				201: 'game#'
			}
		}
	}, function (request, reply) {
		const {db} = this.mongo; const games = db.collection('games');
		const {body} = request;
		const game = {
			_id: body.id,
			name: body.name,
			description: body.description,
			interval: body.interval
		};
		games.insertOne(game)
		.then(({ops}) => reply.code(201).send(ops[0]))
		.catch(error => {
			console.log(error);
			reply.code(500).send({errors: [error]});
		});
	});


	fastify.get('/:id', {
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						game: 'game#',
						pastDrawings: {
							type: 'array',
							items: 'drawing#'
						}
					}
				}
			}
		}
	}, function (request, reply) {
		const {db} = this.mongo; const games = db.collection('games');
		games.findOne({_id: request.params.id})
		.then(result => {
			if (result) {
				const game = {
					id: result._id,
					interval: result.interval,
					description: result.description
				};
				const pastDrawings = [];

				reply.send({
					game,
					pastDrawings
				})
			} else {
				reply.code(404).send({errors: ['Game not found']});
			}
		})
		.catch(error => {
			console.log(error);
			reply.code(500).send({errors: [error]});
		})
	});

	done();
};