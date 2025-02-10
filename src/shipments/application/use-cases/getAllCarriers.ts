import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { Carrier } from '@src/shipments/domain/entities/carrier.entity';

interface GetAllCarriersUseCase {
    execute(): Promise<Carrier[]>;
}

export class GetAllCarriers implements GetAllCarriersUseCase {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    async execute(): Promise<Carrier[]> {
        return await this.shipmentRepository.getAllCarriers();
    }
}
