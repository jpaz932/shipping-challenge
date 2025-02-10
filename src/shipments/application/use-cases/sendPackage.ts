import { CustomError } from '@src/common/errors/custom.error';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';

interface SendPackageUseCase {
    execute(shipmentDto: ShipmentDto): Promise<Shipment>;
}

export class SendPackage implements SendPackageUseCase {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    async execute(shipmentDto: ShipmentDto): Promise<Shipment> {
        const shipment = await this.shipmentRepository.sendPackage(shipmentDto);
        if (!shipment) {
            throw CustomError.internalServerError('Error creating shipment');
        }
        return shipment;
    }
}
