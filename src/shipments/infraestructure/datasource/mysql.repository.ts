import { FastifyInstance, FastifyRequest } from 'fastify';
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
import { ShipmentsHistoryMapper } from '@src/shipments/infraestructure/mapper/shipmentHistory.mapper';
import { ShipmentHistory } from '@src/shipments/domain/entities/ShipmentHistory.entity';
import { RouteMapper } from '@src/shipments/infraestructure/mapper/routesMapper';
import { Routes } from '@src/shipments/domain/entities/routes.entity';
import { StatusRouteDto } from '@src/shipments/domain/dto/routeDto';

export class MysqlShipmentRepository implements ShipmentRepository {
    constructor(private readonly fastify: FastifyInstance) {}
    private pool: Pool | null = null;

    private getPool() {
        if (!this.pool) {
            this.pool = MysqlDatabase.getConnection();
        }
        return this.pool;
    }

    private async getCached<T>(key: string): Promise<T | null> {
        try {
            const cached = await this.fastify.redis.get(key);
            return cached ? (JSON.parse(cached) as T) : null;
        } catch (error) {
            console.error('Redis cache error:', error);
            return null;
        }
    }

    private async setCached(key: string, object: any): Promise<void> {
        try {
            await this.fastify.redis.set(
                key,
                JSON.stringify(object),
                'EX',
                3600,
            );
        } catch (error) {
            console.error('Redis cache error:', error);
        }
    }

    private async invalidateCache(key: string): Promise<void> {
        try {
            await this.fastify.redis.del(key);
        } catch (error) {
            console.error('Redis cache invalidation error:', error);
        }
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
            const cacheKey = `carriers:all:`;
            const cached = await this.getCached(cacheKey);

            if (cached) {
                return (cached as RowDataPacket[]).map((row) =>
                    CarrierMapper.carrierEntityFromObject(row),
                );
            }

            const sql = 'SELECT * FROM carriers';
            const [rows] = await this.getPool().execute<RowDataPacket[]>(sql);

            if (rows[0]) {
                await this.setCached(cacheKey, rows);
                return rows.map((row) =>
                    CarrierMapper.carrierEntityFromObject(row),
                );
            }

            return rows.map((row) =>
                CarrierMapper.carrierEntityFromObject(row),
            );
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    getAllRoutes = async (): Promise<Routes[]> => {
        try {
            const cacheKey = `routes:all`;
            const cached = await this.getCached(cacheKey);

            if (cached) {
                return (cached as RowDataPacket[]).map((row) =>
                    RouteMapper.routesEntityFromObject(row),
                );
            }

            const sql = 'SELECT * FROM routes where status = TRUE';
            const [rows] = await this.getPool().execute<RowDataPacket[]>(sql);

            if (rows[0]) {
                await this.setCached(cacheKey, rows);
                return rows.map((row) =>
                    RouteMapper.routesEntityFromObject(row),
                );
            }

            return rows.map((row) => RouteMapper.routesEntityFromObject(row));
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

    getShipmentByTrackingCode = async (
        trackingCode: string,
    ): Promise<ShipmentHistory> => {
        try {
            const cacheKey = `shipment:trackingCode${trackingCode}`;
            const cached = await this.getCached(cacheKey);

            if (cached) {
                return ShipmentsHistoryMapper.shipmentHistoryEntityFromObject([
                    cached,
                ]);
            }

            const sql = `SELECT s.tracking_code, s.origin_city, s.destination_city, sh.status, sh.created_at 
                FROM shipments s
                INNER JOIN shipment_history sh ON s.id = sh.shipment_id
                WHERE s.tracking_code = ?
            `;
            const values = [trackingCode];
            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                values,
            );

            if (rows[0]) {
                await this.setCached(cacheKey, rows[0]);
                return ShipmentsHistoryMapper.shipmentHistoryEntityFromObject(
                    rows,
                );
            }

            return ShipmentsHistoryMapper.shipmentHistoryEntityFromObject(rows);
        } catch {
            throw CustomError.notFound(
                `Shipment with tracking code ${trackingCode} not found`,
            );
        }
    };

    async changeRouteStatus(
        statusRouteDto: StatusRouteDto,
    ): Promise<{ message: string; status: string }> {
        try {
            const { routeId, status } = statusRouteDto;
            const shipments = await this.getShipmentsIdsByroute(routeId);

            for (const shipment of shipments) {
                const insertSql =
                    'INSERT INTO shipment_history (shipment_id, carrier_id, status) VALUES (?, ?, ?)';
                const insertValues = [
                    shipment.shipment_id,
                    shipment.assigned_carrier_id,
                    status,
                ];

                await Promise.all([
                    this.getPool().execute<ResultSetHeader>(
                        insertSql,
                        insertValues,
                    ),
                    this.updateShipmentStatus(
                        Number(shipment.shipment_id),
                        status,
                    ),
                ]);

                if (status === 'Entregado') {
                    const updateCarrierUbication = `
                        UPDATE carrier_locations
                        SET current_location = (
                            SELECT destination
                            FROM routes
                            WHERE id = ?
                        ), available = TRUE
                        WHERE carrier_id = ?;
                    `;

                    await Promise.all([
                        this.getPool().execute<ResultSetHeader>(
                            updateCarrierUbication,
                            [routeId, shipment.assigned_carrier_id],
                        ),
                        this.invalidateCache(`carriers:all`),
                    ]);
                }
            }

            if (status === 'Entregado') {
                const updateStatusRoute =
                    'UPDATE routes SET status = FALSE WHERE id = ?';

                await Promise.all([
                    this.getPool().execute<ResultSetHeader>(updateStatusRoute, [
                        routeId,
                    ]),
                    this.invalidateCache(`routes:all`),
                ]);
            }

            return { message: 'Status updated successfully', status };
        } catch (error) {
            throw CustomError.internalServerError((error as Error).message);
        }
    }

    private getShipmentsIdsByroute = async (routeId: number) => {
        try {
            const sql = `
                SELECT shipment_id, assigned_carrier_id FROM shipment_routes
                WHERE route_id = ?
            `;
            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                [routeId],
            );

            if (!rows.length) {
                throw CustomError.badRequest(
                    'The route has no shipments assigned',
                );
            }

            return rows;
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
            const cacheKey = `shipment:${id}`;
            const cached = await this.getCached(cacheKey);

            if (cached) {
                return cached;
            }

            const sql = 'SELECT * FROM shipments WHERE id = ?';
            const values = [id];

            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                values,
            );

            if (!rows[0]) {
                throw CustomError.notFound(`Shipment with id ${id} not found`);
            }

            if (rows[0]) {
                await this.setCached(cacheKey, rows[0]);
                return rows[0];
            }

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
                AND r.status = TRUE
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
                await this.invalidateCache(`routes:all`);

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
            const shipment = (await this.getShipmentById(
                shipmentId,
            )) as Shipment;
            await Promise.all([
                this.invalidateCache(
                    `shipment:trackingCode${shipment.tracking_code}`,
                ),
                this.invalidateCache(`shipment:${shipmentId}`),
            ]);

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
