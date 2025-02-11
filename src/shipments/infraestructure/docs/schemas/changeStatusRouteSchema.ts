export const changeStatusRouteSchema = {
    tags: ['Routes'],
    description: 'Permite cambiar el estado de una ruta',
    summary: 'Cambia el estado de una ruta',
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            status: { type: 'string' },
        },
    },
    responses: {
        200: {
            description: 'Ruta actualizada',
            type: 'object',
            properties: {
                message: { type: 'string' },
                status: { type: 'string' },
            },
        },
    },
};
