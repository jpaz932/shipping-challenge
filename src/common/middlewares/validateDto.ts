/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FastifyReply, FastifyRequest } from 'fastify';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export const validateDto = (dto: ClassConstructor<any>) => {
    return async (
        request: FastifyRequest,
        reply: FastifyReply,
        next: (err?: Error) => void,
    ) => {
        const dtoInstance = plainToClass(dto, request.body);
        if (!dtoInstance) {
            return reply.status(400).send({
                message: 'Body is required',
            });
        }
        const errors = await validate(dtoInstance);
        console.log(errors);
        if (errors.length > 0) {
            const errorResponse = {
                message: 'Validation error',
                errors: errors.map((error) => ({
                    field: error.property,
                    messages: error.constraints
                        ? Object.values(error.constraints)
                        : [],
                })),
            };

            return reply.status(400).send(errorResponse);
        }

        next();
    };
};
