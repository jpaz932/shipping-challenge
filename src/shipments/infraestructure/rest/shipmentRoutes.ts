import { FastifyInstance } from 'fastify';
import { validateDto } from '@src/common/middlewares/validateDto';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { ShipmentController } from './shipmentController';
import { ShipmentRepositoryImpl } from '@src/shipments/infraestructure/repositories/shipment.repository';
import { MysqlShipmentRepository } from '@src/shipments/infraestructure/datasource/mysql.repository';
import { sendPackageSchema } from '@src/shipments/infraestructure/docs/schemas/sendPackage';
import { AuthMiddleware } from '@src/common/middlewares/authMiddleware';

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
            preHandler: [validateDto(ShipmentDto)],
            onRequest: [AuthMiddleware.validateJwtToken],
            schema: sendPackageSchema,
        },
        controller.sendPackage,
    );

    done();
};
