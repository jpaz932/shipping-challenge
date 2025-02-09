import { AuthRepository } from "tests/auth/infrastructure/__mocks__/AuthRepository";
import { LoginUser } from "@src/auth/application/use-cases/login";
import { CustomError } from "@src/common/errors/custom.error";

describe("Login use case", () => {
    it("should return a token when the user is logged in", async () => {
        const repository = new AuthRepository();
        const loginUseCase = new LoginUser(repository);

        const user = await loginUseCase.execute({
            email: 'user@email.com',
            password: '12341234'
        });

        expect(user).toHaveProperty('token');
    });

    it("should return a user when the user is logged in", async () => {
        const repository = new AuthRepository();
        const loginUseCase = new LoginUser(repository);

        const user = await loginUseCase.execute({
            email: 'user@email.com',
            password: '12341234'
        });

        expect(user).toHaveProperty('user');
    });

    it("should return an error when password or emai are wrong", async () => {
        const repository = new AuthRepository();
        const loginUseCase = new LoginUser(repository);

        try {
            const user = await loginUseCase.execute({
                email: 'user@email.com',
                password: '123'
            });
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Wrong email or password');
        }
    });

});