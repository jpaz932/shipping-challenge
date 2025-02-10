import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';

export class ShipmentRepository {
    private shipments: Shipment[] = [];

    async sendPackage(shipmentDto: ShipmentDto): Promise<Shipment> {
        const shipment = new Shipment(
            this.shipments.length + 1,
            1,
            shipmentDto.phone,
            shipmentDto.address,
            shipmentDto.dimensions,
            shipmentDto.product_type,
            shipmentDto.weight,
            shipmentDto.origin_city,
            shipmentDto.destination_city,
            'En Espera',
            new Date(),
            new Date(),
            'trakinCode',
        );
        this.shipments.push(shipment);
        return Promise.resolve(shipment);
    }

    async getAllShipments(): Promise<Shipment[]> {
        return Promise.resolve(this.shipments);
    }
}
