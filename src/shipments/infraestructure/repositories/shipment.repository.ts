import { FastifyRequest } from 'fastify';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { IShipmentRepository } from '@src/shipments/domain/interfaces/shipment.interface';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { ShipmentToCarrier } from '@src/shipments/domain/entities/shipmentToCarrier.entity';
import { ShipmentHistory } from '@src/shipments/domain/entities/ShipmentHistory.entity';
import { Routes } from '@src/shipments/domain/entities/routes.entity';

export class ShipmentRepositoryImpl implements IShipmentRepository {
    constructor(
        private readonly shipmentDatasourceRepository: ShipmentRepository,
    ) {}

    sendPackage(shipmentDto: ShipmentDto): Promise<Shipment> {
        return this.shipmentDatasourceRepository.sendPackage(shipmentDto);
    }

    getAllShipments(request: FastifyRequest): Promise<Shipment[]> {
        return this.shipmentDatasourceRepository.getAllShipments(request);
    }

    getAllCarriers() {
        return this.shipmentDatasourceRepository.getAllCarriers();
    }

    assignShipmentToCarrier(shipmentId: number): Promise<ShipmentToCarrier> {
        return this.shipmentDatasourceRepository.assignShipmentToCarrier(
            shipmentId,
        );
    }

    getShipmentByTrackingCode(trackingCode: string): Promise<ShipmentHistory> {
        return this.shipmentDatasourceRepository.getShipmentByTrackingCode(
            trackingCode,
        );
    }

    getAllRoutes(): Promise<Routes[]> {
        return this.shipmentDatasourceRepository.getAllRoutes();
    }
}
