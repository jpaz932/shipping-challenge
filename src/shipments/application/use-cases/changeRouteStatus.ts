import { CustomError } from '@src/common/errors/custom.error';
import { StatusRouteDto } from '@src/shipments/domain/dto/routeDto';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';

interface ChangeRouteStatusUseCase {
    execute(
        statusRouteDto: StatusRouteDto,
    ): Promise<{ message: string; status: string }>;
}

export class ChangeRouteStatus implements ChangeRouteStatusUseCase {
    constructor(private readonly shipmentRepository: ShipmentRepository) {}

    async execute(
        statusRouteDto: StatusRouteDto,
    ): Promise<{ message: string; status: string }> {
        const statusRoute =
            await this.shipmentRepository.changeRouteStatus(statusRouteDto);
        if (!statusRoute) {
            throw CustomError.internalServerError(
                'Error changing route status',
            );
        }
        return statusRoute;
    }
}
