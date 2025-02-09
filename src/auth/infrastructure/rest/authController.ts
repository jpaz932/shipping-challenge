import { RegisterUserDto } from '@src/auth/domain/dtos/registerUser.dto';
import { AuthRepository } from '@src/auth/domain/repositories/auth.repository';
import { CustomError } from '@src/common/errors/custom.error';
import { FastifyRequest, FastifyReply } from 'fastify';

export class AuthController {
    constructor(private readonly authRepository: AuthRepository) {}

    private handlerError(error: unknown, reply: FastifyReply) {
        if (error instanceof CustomError) {
            return reply.code(error.code).send({ message: error.message });
        }

        console.error(error);
        return reply.code(500).send({ message: 'Internal server error' });
    }

    registerUser = (request: FastifyRequest, reply: FastifyReply) => {
        const registerUserDto = request.body as RegisterUserDto;
        this.authRepository.registerUser(registerUserDto)
            .then((user) => reply.status(201).send(user))
            .catch((error) => this.handlerError(error, reply));
    }

    loginUser = (request: FastifyRequest, reply: FastifyReply) => {
        reply.status(200).send({ message: "User logged in" });
    }
}