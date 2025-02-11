export const getAllCarriersSchema = {
    tags: ['Shipments'],
    description: 'Permite consultar todos los transportistas',
    summary: 'Obtiene todos los transportistas',
    response: {
        200: {
            description: 'Transportistas obtenidos',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    phone: { type: 'number' },
                    vehicle_type: { type: 'string' },
                    vehicle_capacity: { type: 'number' },
                },
            },
        },
    },
};
