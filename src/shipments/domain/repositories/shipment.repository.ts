import { FastifyRequest } from 'fastify';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Carrier } from '@src/shipments/domain/entities/carrier.entity';
import { ShipmentToCarrier } from '@src/shipments/domain/entities/shipmentToCarrier.entity';
import { ShipmentHistory } from '@src/shipments/domain/entities/ShipmentHistory.entity';
import { Routes } from '@src/shipments/domain/entities/routes.entity';

export abstract class ShipmentRepository {
    abstract sendPackage(shipmentDto: ShipmentDto): Promise<Shipment>;
    abstract getAllShipments(request: FastifyRequest): Promise<Shipment[]>;
    abstract getAllCarriers(): Promise<Carrier[]>;
    abstract assignShipmentToCarrier(
        shipmentId: number,
    ): Promise<ShipmentToCarrier>;
    abstract getShipmentByTrackingCode(
        trackingCode: string,
    ): Promise<ShipmentHistory>;
    abstract getAllRoutes(): Promise<Routes[]>;
}
