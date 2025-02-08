import mysql from 'mysql2/promise';

interface Options {
    host: string;
    user: string;
    password: string;
    database: string;
}

export class MysqlDatabase {
    static async connect(options: Options) {
        try {
            const connection = await mysql.createPool(options);
            console.log('Connected to MySQL database');
        } catch (error) {
            console.log('Error connecting to MySQL database:', error);
            throw error;
        }
    }
}