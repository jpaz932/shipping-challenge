import { MysqlDatabase } from '@src/config/database/mysql';
import { JwtAdapter } from '@src/utils/jwt';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export class AuthMiddleware {
    static validateJwtToken = async (
        request: FastifyRequest,
        reply: FastifyReply,
        done: HookHandlerDoneFunction,
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
            const user = rows as { is_active: number }[];
            if (!user.length)
                return reply.code(401).send({ message: 'Invalid token' });

            if (!user[0].is_active)
                return reply.code(401).send({ message: 'User is not active' });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (request.body as any).token = payload;
            done();
        } catch (error) {
            console.log(error);
            reply.code(500).send({ message: 'Internal server error' });
        }
    };
}
