import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { IShipmentRepository } from '@src/shipments/domain/interfaces/shipment.interface';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';

export class ShipmentRepositoryImpl implements IShipmentRepository {
    constructor(
        private readonly shipmentDatasourceRepository: ShipmentRepository,
    ) {}

    sendPackage(shipmentDto: ShipmentDto): Promise<Shipment> {
        return this.shipmentDatasourceRepository.sendPackage(shipmentDto);
    }
}
