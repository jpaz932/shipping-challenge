import Fastify from 'fastify';
import { envs } from './config/envs';

const app = Fastify();

const start = async () => {
    try {
        await app.listen({
            port: envs.port,
        });
        console.log(`Server listening on port ${envs.port}`);
    } catch (err) {
        console.error(err);
    }
};

start();