import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";
import { User } from "@src/auth/domain/entities/user.entity";
import { IAuthRepository } from "@src/auth/domain/interfaces/auth.interface";
import { CustomError } from "@src/common/errors/custom.error";
import { MysqlDatabase } from "@src/config/database/mysql";
import { BcryptAdapter } from "@src/utils/bcrypt";
import { Pool } from "mysql2/promise";
export class MysqlAuthRepository implements IAuthRepository {
    private pool: Pool | null = null;
    
    private getPool() {
        if (!this.pool) {
            this.pool = MysqlDatabase.getConnection();
        }
        return this.pool;
    }

    private valideExistingUser = async (email: string): Promise<boolean> => {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const values = [email];

            const [rows] = await this.getPool().execute<any[]>(
                { sql }, values
            );

            return rows.length > 0;
        } catch (error: any) {
            throw CustomError.internalServerError(error.message);
        }
    }

    private createUser = async (user: RegisterUserDto): Promise<number> => {
        try {
            const sql = 'INSERT INTO users (name, document, email, password) VALUES (?, ?, ?, ?)';
            const values = [
                user.name, 
                user.document, 
                user.email, 
                BcryptAdapter.hash(user.password),
            ];

            const [result]: any = await this.getPool().execute(
                { sql }, values
            );
            return result.insertId;
        } catch (error: any) {
            throw CustomError.internalServerError(error.message);
        }
    }

    private getUserById = async (id: number): Promise<User> => {
        try {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const values = [id];

            const [rows] = await this.getPool().execute<any[]>(
                { sql }, values
            );

            const { name, document, email, password, status, role } = rows[0];
            return new User(
                id, 
                name, 
                document, 
                email, 
                password, 
                status, 
                role
            );
        } catch (error: any) {
            throw CustomError.notFound(`User with id ${id} not found`);
        }
    }

    registerUser = async (registerUserDto: RegisterUserDto): Promise<User> => {
        try {
            const userExist = await this.valideExistingUser(registerUserDto.email);
            
            if (userExist) {
                throw CustomError.badRequest(`User with email ${registerUserDto.email} already exists`);
            }
    
            const userId = await this.createUser(registerUserDto);
            return await this.getUserById(userId);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(error.message);
        }
    }
}