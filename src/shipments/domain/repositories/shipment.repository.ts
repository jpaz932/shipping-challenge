import { FastifyRequest } from 'fastify';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';

export abstract class ShipmentRepository {
    abstract sendPackage(shipmentDto: ShipmentDto): Promise<Shipment>;
    abstract getAllShipments(request: FastifyRequest): Promise<Shipment[]>;
}
