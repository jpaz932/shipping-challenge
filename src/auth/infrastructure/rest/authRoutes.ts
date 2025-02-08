import { FastifyInstance } from "fastify";

export const authRoutes = (fastify: FastifyInstance, opts: any, done: () => void) => {
    fastify.post('/login', async (request, reply) => {
        reply.send({ message: 'Login' });
    });
    
    fastify.post('/register', async (request, reply) => {
        reply.send({ message: 'Register' });
    });

    done();
}