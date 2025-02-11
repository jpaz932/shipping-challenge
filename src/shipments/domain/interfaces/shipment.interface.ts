import { FastifyRequest } from 'fastify';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Carrier } from '@src/shipments/domain/entities/carrier.entity';
import { ShipmentToCarrier } from '@src/shipments/domain/entities/shipmentToCarrier.entity';
import { ShipmentHistory } from '@src/shipments/domain/entities/ShipmentHistory.entity';
import { Routes } from '@src/shipments/domain/entities/routes.entity';
import { StatusRouteDto } from '@src/shipments/domain/dto/routeDto';

export interface IShipmentRepository {
    sendPackage(shipmentDto: ShipmentDto): Promise<Shipment>;
    getAllShipments(request: FastifyRequest): Promise<Shipment[]>;
    getAllCarriers(): Promise<Carrier[]>;
    assignShipmentToCarrier(shipmentId: number): Promise<ShipmentToCarrier>;
    getShipmentByTrackingCode(trackingCode: string): Promise<ShipmentHistory>;
    getAllRoutes(): Promise<Routes[]>;
    changeRouteStatus(
        statusRouteDto: StatusRouteDto,
    ): Promise<{ message: string; status: string }>;
}
