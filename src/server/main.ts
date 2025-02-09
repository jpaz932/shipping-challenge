import Fastify from 'fastify';
import { envs } from '@src/config/envs';
import { registerRoutes } from './routes/routes';
import { MysqlDatabase } from '@src/config/database/mysql';

const fastify = Fastify();

registerRoutes(fastify);

const start = async () => {
    try {
        await MysqlDatabase.connect({
            host: envs.mysqlHost,
            user: envs.mysqlUser,
            password: envs.mysqlPassword,
            database: envs.mysqlDbName,
        });

        await fastify.listen({
            port: envs.port,
        });
        console.log(`Server listening on port ${envs.port}`);
    } catch (err) {
        console.error(err);
    }
};

start();