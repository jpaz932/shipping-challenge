import { FastifyInstance } from "fastify";

import { authRoutes } from "@src/auth/infrastructure/rest/authRoutes";
import { AuthMiddleware } from "@src/common/middlewares/authMiddleware";

export const registerRoutes = (fastify: FastifyInstance) => {
    fastify.register(authRoutes, { prefix: '/api/auth' });
}