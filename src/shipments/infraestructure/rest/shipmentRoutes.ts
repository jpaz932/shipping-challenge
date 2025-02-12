import { FastifyInstance } from 'fastify';
import { validateDto } from '@src/common/middlewares/validateDto';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { ShipmentController } from './shipmentController';
import { ShipmentRepositoryImpl } from '@src/shipments/infraestructure/repositories/shipment.repository';
import { MysqlShipmentRepository } from '@src/shipments/infraestructure/datasource/mysql.repository';

import { AuthMiddleware } from '@src/common/middlewares/authMiddleware';
import {
    getAllCarriersSchema,
    getAllShipmentsSchema,
    sendPackageSchema,
    assignShipmentToCarrierSchema,
    getShipmentByTrackingCode,
    getAllRoutesSchema,
    changeStatusRouteSchema,
} from '@src/shipments/infraestructure/docs';
import { StatusRouteDto } from '@src/shipments/domain/dto/routeDto';

export const shipmentRoutes = (
    fastify: FastifyInstance,
    opts: any,
    done: () => void,
) => {
    const database = new MysqlShipmentRepository(fastify);
    const shipmentRepository = new ShipmentRepositoryImpl(database);
    const controller = new ShipmentController(shipmentRepository);
    fastify.post(
        '/send-package',
        {
            onRequest: [AuthMiddleware.validateJwtToken],
            preHandler: [validateDto(ShipmentDto)],
            schema: sendPackageSchema,
        },
        controller.sendPackage,
    );

    fastify.get(
        '/all',
        {
            onRequest: [AuthMiddleware.validateJwtToken],
            schema: getAllShipmentsSchema,
        },
        controller.getAllShipments,
    );

    fastify.get(
        '/carriers/all',
        {
            onRequest: [
                AuthMiddleware.validateJwtToken,
                AuthMiddleware.validateAdmin,
            ],
            schema: getAllCarriersSchema,
        },
        controller.getAllCarriers,
    );

    fastify.post(
        '/assign-shipment-to-carrier',
        {
            onRequest: [
                AuthMiddleware.validateJwtToken,
                AuthMiddleware.validateAdmin,
            ],
            schema: assignShipmentToCarrierSchema,
        },
        controller.assignShipmentToCarrier,
    );

    fastify.get(
        '/tracking-shipment/:trackingCode',
        {
            onRequest: [AuthMiddleware.validateJwtToken],
            schema: getShipmentByTrackingCode,
        },
        controller.getShipmentByTrakingCode,
    );

    fastify.get(
        '/routes/all',
        {
            onRequest: [
                AuthMiddleware.validateJwtToken,
                AuthMiddleware.validateAdmin,
            ],
            schema: getAllRoutesSchema,
        },
        controller.getAllRoutes,
    );

    fastify.post(
        '/routes/status',
        {
            onRequest: [
                AuthMiddleware.validateJwtToken,
                AuthMiddleware.validateAdmin,
            ],
            preHandler: [validateDto(StatusRouteDto)],
            schema: changeStatusRouteSchema,
        },
        controller.changeRouteStatus,
    );

    done();
};
