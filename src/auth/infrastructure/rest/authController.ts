import { RegisterUserDto } from '@src/auth/domain/dtos/registerUser.dto';
import { AuthRepository } from '@src/auth/domain/repositories/auth.repository';
import { FastifyRequest, FastifyReply } from 'fastify';

export class AuthController {
    constructor(private readonly authRepository: AuthRepository) {}

    registerUser = (request: FastifyRequest, reply: FastifyReply) => {
        const registerUserDto = request.body as RegisterUserDto;
        this.authRepository.registerUser(registerUserDto)
            .then((user) => reply.status(201).send(user))
            .catch((error) => reply.status(500).send({ message: error.message }));
    }

    loginUser = (request: FastifyRequest, reply: FastifyReply) => {
        reply.status(200).send({ message: "User logged in" });
    }
}