import Fastify from 'fastify';
import { envs } from '@src/config/envs';
import { registerRoutes } from './routes/routes';

const fastify = Fastify();

registerRoutes(fastify);

const start = async () => {
    try {
        await fastify.listen({
            port: envs.port,
        });
        console.log(`Server listening on port ${envs.port}`);
    } catch (err) {
        console.error(err);
    }
};

start();