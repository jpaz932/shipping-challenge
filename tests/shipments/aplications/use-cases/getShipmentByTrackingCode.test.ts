import { CustomError } from '@src/common/errors/custom.error';
import { GetShipmentByTrackingCode } from '@src/shipments/application/use-cases/getShipmentByTrackingCode';
import { ShipmentRepository } from 'tests/shipments/infrastructure/__mocks__/ShipmentRepository';

describe('Tracking a shipment', () => {
    it('should return the shipment history', async () => {
        const repository = new ShipmentRepository();
        const getTrackingShipmentUseCase = new GetShipmentByTrackingCode(
            repository,
        );

        const shipment = await getTrackingShipmentUseCase.execute('trakinCode');

        expect(shipment).toHaveProperty('tracking_code');
        expect(shipment).toHaveProperty('origin_city');
        expect(shipment).toHaveProperty('destination_city');
        expect(shipment).toHaveProperty('history');
    });

    it('should return an error whem the shipment does not exist', async () => {
        const repository = new ShipmentRepository();
        const getTrackingShipmentUseCase = new GetShipmentByTrackingCode(
            repository,
        );

        try {
            await getTrackingShipmentUseCase.execute('test-code');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect((error as CustomError).message).toBe('Shipment not found');
        }
    });
});
