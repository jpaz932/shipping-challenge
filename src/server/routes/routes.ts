import { FastifyInstance } from "fastify";

import { authRoutes } from "@src/auth/infrastructure/rest/authRoutes";

export const registerRoutes = (fastify: FastifyInstance) => {
    fastify.register(
        async (fastify) => {
            fastify.register(authRoutes, { prefix: '/auth' })
        },
        { prefix: "api" }
    )
}