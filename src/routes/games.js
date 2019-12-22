import gameSchema from '../schemas/game';
import drawingSchema from '../schemas/drawing';
import entrySchema from '../schemas/entry';
import renameKeys from 'rename-keys';

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
	},
	function (request, reply) {
		const {db} = this.mongo; const games = db.collection('games');
		games.find({})
		.toArray()
		.then(results => {
			const games = results.map(result => renameKeys(result, key => {
				if (key === '_id')
					return 'id';
			}));
			reply.send(games);
		})
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
	},
	function (request, reply) {
		const {db} = this.mongo; const games = db.collection('games');
		games.findOne({_id: request.params.id})
		.then(result => {
			if (result) {
				const game = renameKeys(result, key => {
					if (key === '_id')
						return 'id';
				});
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
		},
		attachValidation: true
	},
	function (request, reply) {
		const {body, validationError} = request;
		if (validationError) {
			const errors = validationError.validation.map(error => error.message);
			reply.code(400).send({errors});
			return;
		}
		const {db} = this.mongo; const games = db.collection('games');
		const game = renameKeys(body, key => {
			if (key === 'id')
				return '_id';
		});
		games.insertOne(game)
		.then(({ops}) => {
			const game = renameKeys(ops[0], key => {
				if (key === '_id')
					return 'id';
			});
			reply.code(201).send(game);
		})
		.catch(error => {
			if (error.name === 'MongoError') {
				reply.code(404).send({ errors: [error.errmsg] });
			} else {
				console.log(error);
				reply.code(500).send({errors: [error]});
			}
		});
	});

	done();
};