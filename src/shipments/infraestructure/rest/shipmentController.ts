import { FastifyRequest, FastifyReply } from 'fastify';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { handlerError } from '@src/utils/handlerError';
import { SendPackage } from '@src/shipments/application/use-cases/sendPackage';
import { GetAllShipments } from '@src/shipments/application/use-cases/getAllShipments';
import { CustomError } from '@src/common/errors/custom.error';
import { StatusRouteDto } from '@src/shipments/domain/dto/routeDto';
import { GetAllCarriers } from '@src/shipments/application/use-cases/getAllCarriers';
import { GetShipmentByTrackingCode } from '@src/shipments/application/use-cases/getShipmentByTrackingCode';
import { AssignShipmentToCarrier } from '@src/shipments/application/use-cases/asignShipmentToCarrier';
import { GetAllRoutes } from '@src/shipments/application/use-cases/getAllRoutes';
import { ChangeRouteStatus } from '@src/shipments/application/use-cases/changeRouteStatus';

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
        new GetAllCarriers(this.shipmentRepository)
            .execute()
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

        new AssignShipmentToCarrier(this.shipmentRepository)
            .execute(shipmentId)
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };

    getShipmentByTrakingCode = (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const { trackingCode } = request.params as { trackingCode: string };

        if (!trackingCode) {
            return handlerError(
                CustomError.badRequest('trackingCode  is required'),
                reply,
            );
        }

        new GetShipmentByTrackingCode(this.shipmentRepository)
            .execute(trackingCode)
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };

    getAllRoutes = (request: FastifyRequest, reply: FastifyReply) => {
        new GetAllRoutes(this.shipmentRepository)
            .execute()
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };

    changeRouteStatus = (request: FastifyRequest, reply: FastifyReply) => {
        const statusRouteDto = request.body as StatusRouteDto;

        new ChangeRouteStatus(this.shipmentRepository)
            .execute(statusRouteDto)
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };
}
