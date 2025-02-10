import { ShipmentRepository } from 'tests/shipments/infrastructure/__mocks__/ShipmentRepository';
import { SendPackage } from '@src/shipments/application/use-cases/sendPackage';

describe('SendPackage use case', () => {
    it('should return a shipment when the user creates it', async () => {
        const repository = new ShipmentRepository();
        const registerUseCase = new SendPackage(repository);

        const shipment = await registerUseCase.execute({
            phone: 123456789,
            address: 'Calle 123',
            dimensions: '10x10x10',
            product_type: 'Electronics',
            weight: 10,
            origin_city: 'Bogota',
            destination_city: 'Medellin',
            userId: 1,
        });

        expect(shipment).toHaveProperty('tracking_code');
        expect(shipment).toHaveProperty('weight');
        expect(shipment).toHaveProperty('destination_city');
    });
});
