export default (fastify, opts, done) => {

	fastify.get('/:id', {}, function (request, reply) {});

	fastify.post('/:id/entries', {}, function (request, reply) {});

	done();
};