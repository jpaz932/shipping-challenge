import { FastifyReply } from 'fastify';
import { CustomError } from '@src/common/errors/custom.error';

export const handlerError = (error: unknown, reply: FastifyReply) => {
    if (error instanceof CustomError) {
        return reply.code(error.code).send({ message: error.message });
    }

    console.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
};
