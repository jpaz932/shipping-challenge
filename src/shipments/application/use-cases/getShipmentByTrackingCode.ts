import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { ShipmentHistory } from '@src/shipments/domain/entities/ShipmentHistory.entity';

interface GetShipmentByTrackingCodeUseCase {
    execute(trackingCode: string): Promise<ShipmentHistory>;
}

export class GetShipmentByTrackingCode
    implements GetShipmentByTrackingCodeUseCase
{
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    async execute(trackingCode: string): Promise<ShipmentHistory> {
        return await this.shipmentRepository.getShipmentByTrackingCode(
            trackingCode,
        );
    }
}
