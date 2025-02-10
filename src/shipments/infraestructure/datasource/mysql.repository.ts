import { FastifyRequest } from 'fastify';
import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { MysqlDatabase } from '@src/config/database/mysql';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { CustomError } from '@src/common/errors/custom.error';
import { ShipmentMapper } from '@src/shipments/infraestructure/mapper/shipment.mapper';
import { generateCustomRandomString } from '@src/utils/utils';
import { Carrier } from '@src/shipments/domain/entities/carrier.entity';
import { CarrierMapper } from '@src/shipments/infraestructure/mapper/carrier.mapper';
import { AssigmentShipmentToCarrierMapper } from '../mapper/assigmentShipmentToCarrier';

export class MysqlShipmentRepository implements ShipmentRepository {
    private pool: Pool | null = null;

    private getPool() {
        if (!this.pool) {
            this.pool = MysqlDatabase.getConnection();
        }
        return this.pool;
    }

    sendPackage = async (shipmentDto: ShipmentDto): Promise<Shipment> => {
        try {
            const shipmentId = await this.createShipment(shipmentDto);
            const shipment = await this.getShipmentById(shipmentId);

            return ShipmentMapper.shipmentEntityFromObject(shipment);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    getAllShipments = async (request: FastifyRequest): Promise<Shipment[]> => {
        try {
            const sql =
                request.role === 'Admin'
                    ? 'SELECT * FROM shipments'
                    : 'SELECT * FROM shipments WHERE user_id = ?';
            const values = request.role === 'Admin' ? [] : [request.userId];

            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                values,
            );

            return rows.map((row) =>
                ShipmentMapper.shipmentEntityFromObject(row),
            );
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    getAllCarriers = async (): Promise<Carrier[]> => {
        try {
            const sql = 'SELECT * FROM carriers';
            const [rows] = await this.getPool().execute<RowDataPacket[]>(sql);

            return rows.map((row) =>
                CarrierMapper.carrierEntityFromObject(row),
            );
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    assignShipmentToCarrier = async (id: number) => {
        try {
            const findShipment = await this.getShipmentById(id);
            const shipment =
                ShipmentMapper.shipmentEntityFromObject(findShipment);
            const shipmentId: number = shipment.id;

            const checkShipment =
                await this.validateIfShipmentWasAssignedToCarrier(shipmentId);

            if (checkShipment.length > 0) {
                throw CustomError.badRequest(
                    'Shipment already assigned to a carrier',
                );
            }

            const { origin_city, destination_city, weight } = shipment;
            const route = await this.getAvailableRoute(
                origin_city,
                destination_city,
                weight,
            );

            const carrier = await this.getAvailableCarrier(origin_city);
            if (!carrier) {
                throw CustomError.notFound(
                    'No carrier available. Please try again later.',
                );
            }

            const carrierId: number = (carrier as { id: number }).id;
            const routeId: number = (route as { id: number }).id;

            await Promise.all([
                this.createShipmentAssignation(shipmentId, routeId, carrierId),
                this.createShipmentHistory(shipmentId, carrierId),
                this.updateShipmentStatus(shipmentId, 'Asignado para envío'),
            ]);

            return AssigmentShipmentToCarrierMapper.assigmentShipmentToCarrierEntityFromObject(
                {
                    shipmentId,
                    carrierId,
                    routeId,
                },
            );
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private createShipment = async (
        shipmentDto: ShipmentDto,
    ): Promise<number> => {
        try {
            const code = generateCustomRandomString(shipmentDto.address);
            const sql =
                'INSERT INTO shipments (user_id, phone, address, dimensions, product_type, weight, origin_city, destination_city, tracking_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [
                shipmentDto.userId,
                shipmentDto.phone,
                shipmentDto.address,
                shipmentDto.dimensions,
                shipmentDto.product_type,
                shipmentDto.weight,
                shipmentDto.origin_city,
                shipmentDto.destination_city,
                code,
            ];
            const [result] = await this.getPool().execute<ResultSetHeader>(
                { sql },
                values,
            );
            return result.insertId;
        } catch (error: any) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private getShipmentById = async (id: number) => {
        try {
            const sql = 'SELECT * FROM shipments WHERE id = ?';
            const values = [id];

            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                values,
            );

            return rows[0];
        } catch {
            throw CustomError.notFound(`Shipment with id ${id} not found`);
        }
    };

    private validateIfShipmentWasAssignedToCarrier = async (
        shipmentId: number,
    ) => {
        try {
            const shipment = await this.getPool().execute<RowDataPacket[]>(
                'SELECT * FROM shipment_history WHERE shipment_id = ? limit 1',
                [shipmentId],
            );
            return shipment[0];
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private getAvailableRoute = async (
        origin: string,
        destination: string,
        packageWeight: number,
    ) => {
        try {
            const sql = `
                SELECT r.* FROM routes r
                LEFT JOIN carriers c ON c.id = r.carrier_id
                WHERE r.origin LIKE ? AND r.destination LIKE ?
                AND (
                    r.carrier_id IS NULL
                    OR c.vehicle_capacity >= ? + (
                        SELECT COALESCE(SUM(s.weight), 0)
                        FROM shipment_routes sr
                        INNER JOIN shipments s ON s.id = sr.shipment_id
                        WHERE sr.route_id = r.id
                    )
                )
                LIMIT 1;
            `;
            const values = [origin, destination, packageWeight];

            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                values,
            );

            if (!rows[0]) {
                const sql =
                    'INSERT INTO routes (origin, destination) VALUES (?, ?)';
                const values = [origin, destination];

                const [newRoute] =
                    await this.getPool().execute<ResultSetHeader>(
                        { sql },
                        values,
                    );

                const findSql = 'SELECT * FROM routes WHERE id = ?';
                const findValues = [newRoute.insertId];
                const [route] = await this.getPool().execute<RowDataPacket[]>(
                    findSql,
                    findValues,
                );

                return route[0];
            }

            return rows[0];
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private getAvailableCarrier = async (location: string) => {
        try {
            const sql = `
                SELECT c.id, c.name FROM carriers c
                INNER JOIN carrier_locations cl ON cl.carrier_id = c.id 
                WHERE 
                    cl.current_location LIKE ?
                    AND cl.available = TRUE
                    AND c.vehicle_capacity >= 10 + (
                        SELECT COALESCE(SUM(s.weight), 0)
                        FROM shipment_routes sr
                        INNER JOIN shipments s on s.id = sr.shipment_id
                        WHERE sr.assigned_carrier_id = c.id
                    )
                LIMIT 1;
            `;
            const values = [location];
            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                values,
            );

            return rows[0];
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private createShipmentHistory = async (
        shipmentId: number,
        carrierId: number,
    ) => {
        try {
            const insertSql =
                'INSERT INTO shipment_history (shipment_id, carrier_id, status) VALUES (?, ?, ?)';
            const insertValues = [shipmentId, carrierId, 'Asignado para envío'];
            await this.getPool().execute<ResultSetHeader>(
                insertSql,
                insertValues,
            );
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private createShipmentAssignation = async (
        shipmentId: number,
        routeId: number,
        carrierId: number,
    ) => {
        try {
            const updateSql = 'UPDATE routes SET carrier_id = ? WHERE id = ?';
            const updateValues = [carrierId, routeId];
            await this.getPool().execute<ResultSetHeader>(
                updateSql,
                updateValues,
            );

            const sql =
                'INSERT INTO shipment_routes (shipment_id, route_id, assigned_carrier_id) VALUES (?, ?, ?)';
            const values = [shipmentId, routeId, carrierId];
            await this.getPool().execute<ResultSetHeader>({ sql }, values);
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private updateShipmentStatus = async (
        shipmentId: number,
        status: string,
    ) => {
        try {
            const sql = `
                UPDATE shipments
                SET status = ?
                WHERE id = ?
            `;
            await this.getPool().execute<ResultSetHeader>({ sql }, [
                status,
                shipmentId,
            ]);
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };
}
