import { LoginUser } from '@src/auth/application/use-cases/login';
import { RegisterUser } from '@src/auth/application/use-cases/register';
import { LoginDto } from '@src/auth/domain/dtos/login.dto';
import { RegisterUserDto } from '@src/auth/domain/dtos/registerUser.dto';
import { AuthRepository } from '@src/auth/domain/repositories/auth.repository';
import { handlerError } from '@src/utils/handlerError';
import { FastifyRequest, FastifyReply } from 'fastify';

export class AuthController {
    constructor(private readonly authRepository: AuthRepository) {}

    registerUser = (request: FastifyRequest, reply: FastifyReply) => {
        const registerUserDto = request.body as RegisterUserDto;

        new RegisterUser(this.authRepository)
            .execute(registerUserDto)
            .then((response) => reply.status(201).send(response))
            .catch((error) => handlerError(error, reply));
    };

    loginUser = (request: FastifyRequest, reply: FastifyReply) => {
        const loginDto = request.body as LoginDto;

        new LoginUser(this.authRepository)
            .execute(loginDto)
            .then((response) => reply.status(200).send(response))
            .catch((error) => handlerError(error, reply));
    };
}
