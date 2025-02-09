import { LoginDto } from '@src/auth/domain/dtos/login.dto';
import { RegisterUserDto } from '@src/auth/domain/dtos/registerUser.dto';
import { User } from '@src/auth/domain/entities/user.entity';
import { IAuthRepository } from '@src/auth/domain/interfaces/auth.interface';
import { CustomError } from '@src/common/errors/custom.error';
import { MysqlDatabase } from '@src/config/database/mysql';
import { BcryptAdapter } from '@src/utils/bcrypt';
import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { UserMapper } from '@src/auth/infrastructure/mapper/user.mapper';

export class MysqlAuthRepository implements IAuthRepository {
    private pool: Pool | null = null;

    private getPool() {
        if (!this.pool) {
            this.pool = MysqlDatabase.getConnection();
        }
        return this.pool;
    }

    private validateExistingUser = async (email: string): Promise<User> => {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const values = [email];

            const [rows] = await this.getPool().execute<any[]>({ sql }, values);

            return rows[0] as User;
        } catch (error: any) {
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    private createUser = async (user: RegisterUserDto): Promise<number> => {
        try {
            const sql =
                'INSERT INTO users (name, document, email, password) VALUES (?, ?, ?, ?)';
            const values = [
                user.name,
                user.document,
                user.email,
                BcryptAdapter.hash(user.password),
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

    private getUserById = async (id: number) => {
        try {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const values = [id];

            const [rows] = await this.getPool().execute<RowDataPacket[]>(
                { sql },
                values,
            );

            return rows[0];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
            throw CustomError.notFound(`User with id ${id} not found`);
        }
    };

    registerUser = async (registerUserDto: RegisterUserDto): Promise<User> => {
        try {
            const userExist = await this.validateExistingUser(
                registerUserDto.email,
            );

            if (userExist) {
                throw CustomError.badRequest(
                    `User with email ${registerUserDto.email} already exists`,
                );
            }

            const userId = await this.createUser(registerUserDto);
            const user = await this.getUserById(userId);
            return UserMapper.userEntityFromObject(user);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError((error as Error).message);
        }
    };

    login = async (loginDto: LoginDto): Promise<User> => {
        try {
            const userExist = await this.validateExistingUser(loginDto.email);
            if (!userExist) {
                throw CustomError.badRequest('Wrong email or password');
            }

            if (!userExist.is_active)
                throw CustomError.forbidden('User is not active');

            const match = BcryptAdapter.compare(
                loginDto.password,
                userExist.password,
            );
            if (!match) {
                throw CustomError.unauthorized('Wrong email or password');
            }
            return UserMapper.userEntityFromObject(userExist);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError((error as Error).message);
        }
    };
}
