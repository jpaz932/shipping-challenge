/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CustomError } from '@src/common/errors/custom.error';
import { ShipmentToCarrier } from '@src/shipments/domain/entities/shipmentToCarrier.entity';

export class AssigmentShipmentToCarrierMapper {
    static assigmentShipmentToCarrierEntityFromObject(object: {
        [key: string]: any;
    }) {
        const { shipmentId, carrierId, routeId } = object;

        if (!shipmentId) throw CustomError.badRequest('Missing shipmentId');
        if (!carrierId) throw CustomError.badRequest('Missing carrierId');
        if (!routeId) throw CustomError.badRequest('Missing routeId');

        return new ShipmentToCarrier(shipmentId, carrierId, routeId);
    }
}
