import { FastifyRequest, FastifyReply } from 'fastify';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { handlerError } from '@src/utils/handlerError';
import { SendPackage } from '@src/shipments/application/use-cases/sendPackage';

export class ShipmentController {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    sendPackage = (request: FastifyRequest, reply: FastifyReply) => {
        const shipmentDto = request.body as ShipmentDto;

        new SendPackage(this.shipmentRepository)
            .execute({ ...shipmentDto, userId: request.userId ?? 0 })
            .then((response) => reply.status(201).send(response))
            .catch((error) => handlerError(error, reply));
    };
}
