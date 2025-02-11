import { ShipmentRepository } from 'tests/shipments/infrastructure/__mocks__/ShipmentRepository';
import { GetAllRoutes } from '@src/shipments/application/use-cases/getAllRoutes';

describe('GetAll routes use case', () => {
    it('should return all routes', async () => {
        const repository = new ShipmentRepository();
        const getAllUseCase = new GetAllRoutes(repository);

        const routes = await getAllUseCase.execute();

        expect(routes).toHaveLength(1);
        expect(routes[0].origin).toEqual('Manizales');
        expect(routes[0]).toHaveProperty('id');
    });
});
