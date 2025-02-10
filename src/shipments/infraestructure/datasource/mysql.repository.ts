import { FastifyRequest } from 'fastify';
import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { MysqlDatabase } from '@src/config/database/mysql';
import { ShipmentRepository } from '@src/shipments/domain/repositories/shipment.repository';
import { ShipmentDto } from '@src/shipments/domain/dto/shipment.dto';
import { Shipment } from '@src/shipments/domain/entities/shipment.entity';
import { CustomError } from '@src/common/errors/custom.error';
import { ShipmentMapper } from '@src/shipments/infraestructure/mapper/shipment.mapper';
import { generateCustomRandomString } from '@src/utils/utils';

export class MysqlShipmentRepository implements ShipmentRepository {
    private pool: Pool | null = null;

    private getPool() {
        if (!this.pool) {
            this.pool = MysqlDatabase.getConnection();
        }
        return this.pool;
    }

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
}
