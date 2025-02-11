export const assignShipmentToCarrierSchema = {
    tags: ['Shipments'],
    description: 'Permite assignar un envio a una ruta y un transportista',
    summary: 'Asignar envio a transportista',
    body: {
        type: 'object',
        properties: {
            shipmentId: { type: 'number' },
        },
    },
    response: {
        200: {
            description: 'Envio asignado',
            type: 'object',
            properties: {
                shipmentId: { type: 'number' },
                carrierId: { type: 'number' },
                routeId: { type: 'number' },
            },
        },
    },
};
