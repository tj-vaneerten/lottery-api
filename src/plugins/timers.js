import fp from 'fastify-plugin';

const timersPlugin = (fastify, opts, done) => {

	const timers = {};

	const start = (name, fn, opts) => {
		const {interval, next} = opts;
		if (timers[name])
			stop(name);

		// next specifies timeout for initial run, then starts interval
		if (next || next === 0) {
			timers[name] = setTimeout(() => {
				fn();
				timers[name] = setInterval(fn, interval);
			}, next);
		} else {
			timers[name] = setInterval(fn, interval);
		}

	};

	const stop = name => {
		if (timers[name]) {
			clearInterval(timers[name]);
			delete timers[name];
		}
	}

	const stopAll = () => {
		Object.keys(timers).forEach(timer => {
			stop(timer);
		});
	}

	const timersDecorator = {
		start,
		stop,
		stopAll,
		list: () => Object.keys(timers)
	}

	fastify.decorate('timers', timersDecorator);

	done();
}

export default fp(timersPlugin);