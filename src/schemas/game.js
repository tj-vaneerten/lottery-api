export default {
	$id: 'game',
	type: 'object',
	properties: {
		id: { type: 'string' },
		description: { type: 'string' },
		interval: { type: 'number' },
		lastDrawingTime: { type: 'string', format: 'date-time' },
		nextDrawingTime: { type: 'string', format: 'date-time' } 
	}
};