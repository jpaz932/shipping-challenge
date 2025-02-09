import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    JWT_SECRET: string;
    MYSQL_HOST: string;
    MYSQL_USER: string;
    MYSQL_PASS?: string;
    MYSQL_DB_NAME: string;
    MYSQL_PORT?: number;
}

const envSchema = joi
    .object({
        PORT: joi.number().required(),
        JWT_SECRET: joi.string().required(),
        MYSQL_HOST: joi.string().required(),
        MYSQL_USER: joi.string().required(),
        MYSQL_PASS: joi.string().optional().allow(""),
        MYSQL_DB_NAME: joi.string().required(),
        MYSQL_PORT: joi.number().optional(),
    })
    .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

const { 
    PORT: port = 3000,
    JWT_SECRET: jwtSecret,
    MYSQL_HOST: mysqlHost,
    MYSQL_USER: mysqlUser,
    MYSQL_PASS: mysqlPassword = '',
    MYSQL_DB_NAME: mysqlDbName,
    MYSQL_PORT: mysqlPort = 3306,
  } = envVars;

export const envs = {
    port,
    jwtSecret,
    mysqlHost,
    mysqlUser,
    mysqlPassword,
    mysqlDbName,
    mysqlPort,
};
