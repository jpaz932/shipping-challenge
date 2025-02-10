import { ShipmentRepository } from 'tests/shipments/infrastructure/__mocks__/ShipmentRepository';
import { GetAllCarriers } from '@src/shipments/application/use-cases/getAllCarriers';

describe('GetAll carriers use case', () => {
    it('should return all carriers', async () => {
        const repository = new ShipmentRepository();
        const getAllUseCase = new GetAllCarriers(repository);

        const shipments = await getAllUseCase.execute();

        expect(shipments).toHaveLength(1);
        expect(shipments[0].name).toEqual('Jhon Doe');
        expect(shipments[0]).toHaveProperty('id');
        expect(shipments[0].vehicle_capacity).toBeGreaterThan(0);
    });
});
