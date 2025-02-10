import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';

export interface IShipmentRepository {
    sendPackage(shipmentDto: ShipmentDto): Promise<Shipment>;
}
