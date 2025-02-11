import { FastifyInstance } from 'fastify';
import { AuthController } from './authController';
import { validateDto } from '@src/common/middlewares/validateDto';
import { RegisterUserDto } from '@src/auth/domain/dtos/registerUser.dto';
import { AuthRepositoryImpl } from '@src/auth/infrastructure/repositories/auth.repository';
import { MysqlAuthRepository } from '@src/auth/infrastructure/datasource/mysql.repository';
import { LoginDto } from '@src/auth/domain/dtos/login.dto';
import { loginSchema } from '@src/auth/infrastructure/docs/schemas/login';
import { registerSchema } from '@src/auth/infrastructure/docs/schemas/register';

export const authRoutes = (
    fastify: FastifyInstance,
    opts: any,
    done: () => void,
) => {
    const database = new MysqlAuthRepository(fastify);
    const authRepository = new AuthRepositoryImpl(database);
    const controller = new AuthController(authRepository);

    fastify.post(
        '/login',
        {
            preHandler: [validateDto(LoginDto)],
            schema: loginSchema,
        },
        controller.loginUser,
    );
    fastify.post(
        '/register',
        {
            preHandler: [validateDto(RegisterUserDto)],
            schema: registerSchema,
        },
        controller.registerUser,
    );

    done();
};
