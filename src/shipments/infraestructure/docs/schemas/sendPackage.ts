export const sendPackageSchema = {
    tags: ['Shipments'],
    description: 'Permite a un usuario enviar un paquete',
    summary: 'Envio de paquete',
    body: {
        type: 'object',
        properties: {
            phone: { type: 'number' },
            address: { type: 'string' },
            dimensions: { type: 'string' },
            product_type: { type: 'string' },
            weight: { type: 'number' },
            origin_city: { type: 'string' },
            destination_city: { type: 'string' },
        },
    },
    responses: {
        201: {
            description: 'Envio de paquete exitoso',
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
};
