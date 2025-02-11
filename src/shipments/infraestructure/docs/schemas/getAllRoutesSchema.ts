export const getAllRoutesSchema = {
    tags: ['Shipments'],
    description: 'Permite consultar todas las rutas activas',
    summary: 'Obtiene todas las rutas',
    response: {
        200: {
            description: 'Rutas obtenidas',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    origin: { type: 'string' },
                    destination: { type: 'string' },
                    carrier_id: { type: 'number' },
                },
            },
        },
    },
};
