export default {
	$id: 'drawing',
	type: 'object',
	properties: {
		id: { type: 'number' },
		datetime: { type: 'string', format: 'datetime' },
		game: { type: 'string' },
		entries: { type: 'array', items: 'entry#' },
		result: {
			type: 'object',
			properties: {
				numbers: {
					type: 'array',
					items: {
						type: 'number'
					}
				},
				winners: { type: 'array', items: 'entry#' }
			}
		}
	}
};
