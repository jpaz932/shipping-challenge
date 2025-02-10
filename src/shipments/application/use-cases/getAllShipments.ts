import { FastifyRequest } from 'fastify';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';

interface GetAllShipmentsUseCase {
    execute(request: FastifyRequest): Promise<Shipment[]>;
}

export class GetAllShipments implements GetAllShipmentsUseCase {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    async execute(request: FastifyRequest): Promise<Shipment[]> {
        return await this.shipmentRepository.getAllShipments(request);
    }
}
