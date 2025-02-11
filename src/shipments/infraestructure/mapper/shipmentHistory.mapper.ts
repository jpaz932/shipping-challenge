import { CustomError } from '@src/common/errors/custom.error';
import {
    ShipmentHistory,
    ShipmentHistoryItem,
} from '@src/shipments/domain/entities/ShipmentHistory.entity';

export class ShipmentsHistoryMapper {
    static shipmentHistoryEntityFromObject(object: any[]) {
        const history = object.map((item: ShipmentHistoryItem) => {
            const { status, created_at } = item;
            if (!status) throw CustomError.badRequest('Missing status');
            if (!created_at) throw CustomError.badRequest('Missing created_at');
            return { status, created_at };
        });

        const { tracking_code, origin_city, destination_city } =
            object[0] as Pick<
                ShipmentHistory,
                'tracking_code' | 'origin_city' | 'destination_city'
            >;

        if (!tracking_code)
            throw CustomError.badRequest('Missing tracking_code');
        if (!origin_city) throw CustomError.badRequest('Missing origin_city');
        if (!destination_city)
            throw CustomError.badRequest('Missing destination_city');

        return new ShipmentHistory(
            tracking_code,
            origin_city,
            destination_city,
            history,
        );
    }
}
