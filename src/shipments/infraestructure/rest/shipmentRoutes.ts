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
} from '@src/shipments/infraestructure/docs';

const database = new MysqlShipmentRepository();
const shipmentRepository = new ShipmentRepositoryImpl(database);
const controller = new ShipmentController(shipmentRepository);

export const shipmentRoutes = (
    fastify: FastifyInstance,
    opts: any,
    done: () => void,
) => {
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

    done();
};
