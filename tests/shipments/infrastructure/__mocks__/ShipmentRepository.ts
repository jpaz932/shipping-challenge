import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Carrier } from '@src/shipments/domain/entities/carrier.entity';
import { ShipmentToCarrier } from '@src/shipments/domain/entities/shipmentToCarrier.entity';
import { CustomError } from '@src/common/errors/custom.error';
import { ShipmentHistory } from '@src/shipments/domain/entities/ShipmentHistory.entity';
import { Routes } from '@src/shipments/domain/entities/routes.entity';
import { StatusRouteDto } from '@src/shipments/domain/dto/routeDto';

export class ShipmentRepository {
    private shipments: Shipment[] = [
        new Shipment(
            1,
            1,
            12345,
            'Calle 123',
            '10x10x10',
            'Electronics',
            10,
            'Manizales',
            'Bogota',
            'En Espera',
            new Date(),
            new Date(),
            'trakinCode',
        ),
    ];
    private routes = [new Routes(1, 'Manizales', 'Bogota', 1)];
    private carriers: Carrier[] = [
        new Carrier(1, 'Jhon Doe', 12345, 'Camioneta', 100),
    ];

    private shipmentHistory: {
        shipment_id: number;
        carrier_id: number;
        status: string;
        created_at: Date;
        updated_at: Date;
    }[] = [];

    async sendPackage(shipmentDto: ShipmentDto): Promise<Shipment> {
        const shipment = new Shipment(
            this.shipments.length + 1,
            1,
            shipmentDto.phone,
            shipmentDto.address,
            shipmentDto.dimensions,
            shipmentDto.product_type,
            shipmentDto.weight,
            shipmentDto.origin_city,
            shipmentDto.destination_city,
            'En Espera',
            new Date(),
            new Date(),
            'trakinCode',
        );
        this.shipments.push(shipment);
        return Promise.resolve(shipment);
    }

    async getAllShipments(): Promise<Shipment[]> {
        return Promise.resolve(this.shipments);
    }

    async getAllCarriers(): Promise<Carrier[]> {
        return Promise.resolve(this.carriers);
    }

    async assignShipmentToCarrier(
        shipmentId: number,
    ): Promise<ShipmentToCarrier> {
        const shipment = this.shipments.find(
            (shipment) => shipment.id === shipmentId,
        );

        if (!shipment) {
            throw CustomError.notFound('Shipment not found');
        }

        const route = this.routes.find(
            (route) =>
                route.origin === shipment?.origin_city &&
                route.destination === shipment?.destination_city,
        );
        const shipmentCarrier = {
            shipmentId: shipmentId,
            carrierId: route?.carrier_id,
            routeId: route?.carrier_id,
        };
        return Promise.resolve(
            new ShipmentToCarrier(
                shipmentCarrier.shipmentId,
                Number(shipmentCarrier.carrierId),
                Number(shipmentCarrier.routeId),
            ),
        );
    }

    async getShipmentByTrackingCode(
        trackingCode: string,
    ): Promise<ShipmentHistory> {
        const shipment = this.shipments.find(
            (shipment) => shipment.tracking_code === trackingCode,
        );

        if (!shipment) {
            throw CustomError.notFound('Shipment not found');
        }

        return Promise.resolve(
            new ShipmentHistory(
                shipment.tracking_code,
                shipment.origin_city,
                shipment.destination_city,
                [
                    {
                        status: shipment.status,
                        created_at: shipment.created_at,
                    },
                ],
            ),
        );
    }

    async getAllRoutes(): Promise<Routes[]> {
        return Promise.resolve(this.routes);
    }

    async changeRouteStatus(
        statusRouteDto: StatusRouteDto,
    ): Promise<{ message: string; status: string }> {
        this.shipmentHistory.push({
            shipment_id: 1,
            carrier_id: 1,
            status: statusRouteDto.status,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return Promise.resolve({
            message: 'Status updated',
            status: statusRouteDto.status,
        });
    }
}
