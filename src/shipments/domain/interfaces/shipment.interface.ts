import { FastifyRequest } from 'fastify';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Carrier } from '@src/shipments/domain/entities/carrier.entity';
import { ShipmentToCarrier } from '@src/shipments/domain/entities/shipmentToCarrier.entity';

export interface IShipmentRepository {
    sendPackage(shipmentDto: ShipmentDto): Promise<Shipment>;
    getAllShipments(request: FastifyRequest): Promise<Shipment[]>;
    getAllCarriers(): Promise<Carrier[]>;
    assignShipmentToCarrier(shipmentId: number): Promise<ShipmentToCarrier>;
}
