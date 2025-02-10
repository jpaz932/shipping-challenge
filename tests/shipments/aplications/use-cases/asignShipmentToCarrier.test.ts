import { CustomError } from '@src/common/errors/custom.error';
import { AssignShipmentToCarrier } from '@src/shipments/application/use-cases/asignShipmentToCarrier';
import { ShipmentRepository } from 'tests/shipments/infrastructure/__mocks__/ShipmentRepository';

describe('Assign shipment to carrier', () => {
    it('should return shipment id, route id and carrier id when user creates it', async () => {
        const repository = new ShipmentRepository();
        const registerUseCase = new AssignShipmentToCarrier(repository);

        const shipment = await registerUseCase.execute(1);

        expect(shipment).toHaveProperty('shipmentId');
        expect(shipment).toHaveProperty('carrierId');
        expect(shipment).toHaveProperty('routeId');
    });

    it('should return an error when user tries to assign a shipment that does not exist', async () => {
        const repository = new ShipmentRepository();
        const registerUseCase = new AssignShipmentToCarrier(repository);

        try {
            await registerUseCase.execute(2);
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect((error as CustomError).message).toBe('Shipment not found');
        }
    });
});
