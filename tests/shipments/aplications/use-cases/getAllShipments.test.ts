import { ShipmentRepository } from 'tests/shipments/infrastructure/__mocks__/ShipmentRepository';
import { GetAllShipments } from '@src/shipments/application/use-cases/getAllShipments';
import { FastifyRequest } from 'fastify';

describe('GetAll shipments use case', () => {
    it('should return all shipments', async () => {
        const repository = new ShipmentRepository();
        const getAllUseCase = new GetAllShipments(repository);

        const request = {} as FastifyRequest;
        const shipments = await getAllUseCase.execute(request);

        expect(shipments).toHaveLength(0);
    });
});
