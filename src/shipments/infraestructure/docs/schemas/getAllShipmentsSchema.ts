export const getAllShipmentsSchema = {
    tags: ['Shipments'],
    description: 'Permite consultar todos los envios',
    summary: 'Obtiene todos los envios',
    response: {
        200: {
            description: 'Envios obtenidos',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    user_id: { type: 'number' },
                    phone: { type: 'number' },
                    address: { type: 'string' },
                    dimensions: { type: 'string' },
                    product_type: { type: 'string' },
                    weight: { type: 'number' },
                    origin_city: { type: 'string' },
                    destination_city: { type: 'string' },
                    status: { type: 'string' },
                    tracking_code: { type: 'string' },
                    created_at: { type: 'string' },
                    updated_at: { type: 'string' },
                },
            },
        },
    },
};
