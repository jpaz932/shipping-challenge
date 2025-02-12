import { MysqlDatabase } from '@src/config/database/mysql';
import { JwtAdapter } from '@src/utils/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        userId?: number;
        role?: string;
    }
}

export class AuthMiddleware {
    static validateJwtToken = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const authorization = request.headers.authorization;
        if (!authorization)
            return reply.code(401).send({ message: 'Token not provided' });
        if (!authorization.startsWith('Bearer '))
            return reply.code(401).send({ message: 'Invalid token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.verifyToken<{ id: number }>(token);
            if (!payload)
                return reply.code(401).send({ message: 'Invalid token' });

            const [rows] = await MysqlDatabase.getConnection().execute(
                'SELECT * FROM users WHERE id = ?',
                [payload.id],
            );
            const user = rows as { is_active: number; role: string }[];
            if (!user.length)
                return reply.code(401).send({ message: 'Invalid token' });

            if (!user[0].is_active)
                return reply.code(401).send({ message: 'User is not active' });

            request.role = user[0].role;
            request.userId = payload.id;
        } catch (error) {
            console.log(error);
            reply.code(500).send({ message: 'Internal server error' });
        }
    };

    static validateAdmin = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            if (request.role !== 'Admin') {
                return reply.code(403).send({
                    message:
                        'You do not have permissions to perform this action',
                });
            }
        } catch (error) {
            console.log(error);
            reply.code(500).send({ message: 'Internal server error' });
        }
    };
}
