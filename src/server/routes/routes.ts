import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

import { authRoutes } from '@src/auth/infrastructure/rest/authRoutes';
import { shipmentRoutes } from '@src/shipments/infraestructure/rest/shipmentRoutes';

export const registerRoutes = (fastify: FastifyInstance) => {
    fastify.register(swagger, {
        swagger: {
            info: {
                title: 'API Documentation',
                description: 'Documentación de la API con Swagger',
                version: '1.0.0',
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Más información sobre Swagger',
            },
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    });

    fastify.register(swaggerUI, {
        routePrefix: '/swagger/docs',
        staticCSP: true,
        transformSpecificationClone: true,
    });

    fastify.register(authRoutes, { prefix: '/api/auth' });
    fastify.register(shipmentRoutes, { prefix: '/api/shipment' });
};
