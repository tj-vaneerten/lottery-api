export default {
	$id: 'entry',
	type: 'object',
	properties: {
		picks: {
			type: 'array',
			items: {
				type: 'number'
			}
		},
		player: { type: 'string' },
		drawing: { type: 'number' }
	}
}
