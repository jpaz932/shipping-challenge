import { FastifyInstance } from "fastify";
import { AuthController } from "./authController";
import { validateDto } from "@src/common/middlewares/validateDto";
import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";

const controller = new AuthController();
export const authRoutes = (fastify: FastifyInstance, opts: any, done: () => void) => {
    fastify.post('/login', controller.loginUser);
    fastify.post('/register', { preHandler: validateDto(RegisterUserDto) }, controller.registerUser);

    done();
}