import mysql, { Pool } from 'mysql2/promise';

interface Options {
    host: string;
    user: string;
    password: string;
    database: string;
}

export class MysqlDatabase {
    private static pool: Pool;

    static connect(options: Options) {
        try {
            this.pool = mysql.createPool(options);
            console.log('Connected to MySQL database');
        } catch (error) {
            console.log('Error connecting to MySQL database:', error);
            throw error;
        }
    }

    static getConnection() {
        if (!this.pool) {
            throw new Error('Database connection not established');
        }
        return this.pool;
    }
}
