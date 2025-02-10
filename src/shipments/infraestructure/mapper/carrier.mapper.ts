import { CustomError } from '@src/common/errors/custom.error';
import { Carrier } from '@src/shipments/domain/entities/carrier.entity';

export class CarrierMapper {
    static carrierEntityFromObject(object: { [key: string]: any }) {
        const { id, name, phone, vehicle_type, vehicle_capacity } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!phone) throw CustomError.badRequest('Missing phone');
        if (!vehicle_type) throw CustomError.badRequest('Missing vehicle type');
        if (!vehicle_capacity)
            throw CustomError.badRequest('Missing vehicle capacity');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return new Carrier(id, name, phone, vehicle_type, vehicle_capacity);
    }
}
