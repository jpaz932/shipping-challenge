export const getShipmentByTrackingCode = {
    tags: ['Shipments'],
    description: 'Permite reastrer un envio por su codigo de seguimiento',
    summary: 'Obtiene un envio por su codigo de seguimiento',
    params: {
        type: 'object',
        properties: {
            trackingCode: { type: 'string' },
        },
    },
    response: {
        200: {
            description: 'Envio encontrado',
            type: 'object',
            properties: {
                tracking_code: { type: 'string' },
                origin_city: { type: 'string' },
                destination_city: { type: 'string' },
                history: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            created_at: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
};
