import { FastifyRequest, FastifyReply } from 'fastify';

export class AuthController {
    constructor() { }

    async registerUser(request: FastifyRequest, reply: FastifyReply) {
        reply.status(201).send(request.body);
    }

    async loginUser(request: FastifyRequest, reply: FastifyReply) {
        reply.status(200).send({ message: "User logged in" });
    }
}