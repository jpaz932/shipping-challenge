import { FastifyRequest, FastifyReply } from 'fastify';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { handlerError } from '@src/utils/handlerError';
import { SendPackage } from '@src/shipments/application/use-cases/sendPackage';
import { GetAllShipments } from '@src/shipments/application/use-cases/getAllShipments';
import { CustomError } from '@src/common/errors/custom.error';

export class ShipmentController {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    sendPackage = (request: FastifyRequest, reply: FastifyReply) => {
        const shipmentDto = request.body as ShipmentDto;

        new SendPackage(this.shipmentRepository)
            .execute({ ...shipmentDto, userId: request.userId ?? 0 })
            .then((response) => reply.status(201).send(response))
            .catch((error) => handlerError(error, reply));
    };

    getAllShipments = (request: FastifyRequest, reply: FastifyReply) => {
        new GetAllShipments(this.shipmentRepository)
            .execute(request)
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };

    getAllCarriers = (request: FastifyRequest, reply: FastifyReply) => {
        this.shipmentRepository
            .getAllCarriers()
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };

    assignShipmentToCarrier = (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const { shipmentId } = request.body as { shipmentId: number };

        if (!shipmentId) {
            return handlerError(
                CustomError.badRequest('ShipmentId is required'),
                reply,
            );
        }

        this.shipmentRepository
            .assignShipmentToCarrier(shipmentId)
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };
}
