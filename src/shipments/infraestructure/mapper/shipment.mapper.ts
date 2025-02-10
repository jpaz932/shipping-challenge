import { CustomError } from '@src/common/errors/custom.error';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';

export class ShipmentMapper {
    static shipmentEntityFromObject(object: { [key: string]: any }) {
        const {
            id,
            user_id,
            phone,
            address,
            dimensions,
            product_type,
            weight,
            status,
            origin_city,
            destination_city,
            created_at,
            updated_at,
        } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!phone) throw CustomError.badRequest('Missing phone');
        if (!address) throw CustomError.badRequest('Missing address');
        if (!dimensions) throw CustomError.badRequest('Missing dimensions');
        if (!product_type) throw CustomError.badRequest('Missing product_type');
        if (!weight) throw CustomError.badRequest('Missing weight');
        if (!status) throw CustomError.badRequest('Missing status');
        if (!origin_city) throw CustomError.badRequest('Missing origin_city');
        if (!destination_city)
            throw CustomError.badRequest('Missing destination_city');
        if (!created_at) throw CustomError.badRequest('Missing created_at');
        if (!updated_at) throw CustomError.badRequest('Missing updated_at');

        return new Shipment(
            id,
            user_id,
            phone,
            address,
            dimensions,
            product_type,
            weight,
            status,
            origin_city,
            destination_city,
            created_at,
            updated_at,
        );
    }
}
