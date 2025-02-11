import Fastify from 'fastify';
import { envs } from '@src/config/envs';
import { registerRoutes } from './routes/routes';
import { MysqlDatabase } from '@src/config/database/mysql';
import FastifyRedis from '@fastify/redis';

const fastify = Fastify();

registerRoutes(fastify);

const start = async () => {
    try {
        MysqlDatabase.connect({
            host: envs.mysqlHost,
            user: envs.mysqlUser,
            password: envs.mysqlPassword,
            database: envs.mysqlDbName,
        });

        fastify.register(FastifyRedis, {
            host: '127.0.0.1',
            port: 6379,
            closeClient: true,
            maxRetriesPerRequest: 3,
            connectTimeout: 5000,
        });

        await fastify.listen({
            port: envs.port,
        });
        console.log(`Server listening on port ${envs.port}`);
    } catch (err) {
        console.error(err);
    }
};

void start();
