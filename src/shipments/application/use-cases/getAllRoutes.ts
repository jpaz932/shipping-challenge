import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { Routes } from '@src/shipments/domain/entities/routes.entity';

interface GetAllRoutesUseCase {
    execute(): Promise<Routes[]>;
}

export class GetAllRoutes implements GetAllRoutesUseCase {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    async execute(): Promise<Routes[]> {
        return await this.shipmentRepository.getAllRoutes();
    }
}
