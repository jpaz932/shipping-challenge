import { ChangeRouteStatus } from '@src/shipments/application/use-cases/changeRouteStatus';
import { ShipmentRepository } from 'tests/shipments/infrastructure/__mocks__/ShipmentRepository';

describe('Change route status use case', () => {
    it('should return route id and status when user updates it', async () => {
        const repository = new ShipmentRepository();
        const changeRouteStatus = new ChangeRouteStatus(repository);

        const route = await changeRouteStatus.execute({
            routeId: 1,
            status: 'En Tránsito',
        });

        expect(route).toHaveProperty('message');
        expect(route).toHaveProperty('status');
    });
});
