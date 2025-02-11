import { CustomError } from '@src/common/errors/custom.error';
import { Routes } from '@src/shipments/domain/entities/routes.entity';

export class RouteMapper {
    static routesEntityFromObject(object: { [key: string]: any }) {
        const { id, origin, destination, carrier_id } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!origin) throw CustomError.badRequest('Missing origin');
        if (!destination) throw CustomError.badRequest('Missing destination');
        if (!carrier_id) throw CustomError.badRequest('Missing carrier_id');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return new Routes(id, origin, destination, carrier_id);
    }
}
