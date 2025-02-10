import { CustomError } from '@src/common/errors/custom.error';
import { ShipmentToCarrier } from '@src/shipments/domain/entities/shipmentToCarrier.entity';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';

interface AssignShipmentToCarrierUseCase {
    execute(shipmentId: number): Promise<ShipmentToCarrier>;
}

export class AssignShipmentToCarrier implements AssignShipmentToCarrierUseCase {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    async execute(shipmentId: number): Promise<ShipmentToCarrier> {
        const shipment =
            await this.shipmentRepository.assignShipmentToCarrier(shipmentId);
        if (!shipment) {
            throw CustomError.internalServerError(
                'Error assigning shipment to carrier',
            );
        }
        return shipment;
    }
}
