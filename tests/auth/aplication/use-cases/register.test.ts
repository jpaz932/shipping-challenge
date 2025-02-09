import { AuthRepository } from "tests/auth/infrastructure/__mocks__/AuthRepository";
import { CustomError } from "@src/common/errors/custom.error";
import { RegisterUser } from "@src/auth/application/use-cases/register";

describe("Register use case", () => {
    it("should return a token when when the user is registered", async () => {
        const repository = new AuthRepository();
        const registerUseCase = new RegisterUser(repository);

        const user = await registerUseCase.execute({
            name: 'User 2',
            document: 123456789,
            email: 'user2@email.com',
            password: '12341234'
        });

        expect(user).toHaveProperty('token');
    });

    it("should return a user when the user is registered", async () => {
        const repository = new AuthRepository();
        const registerUseCase = new RegisterUser(repository);

        const user = await registerUseCase.execute({
            name: 'User 2',
            document: 123456789,
            email: 'user2@email.com',
            password: '12341234'
        });

        expect(user).toHaveProperty('user');
    });

    it("should return an error when the user is already registered", async () => {
        const repository = new AuthRepository();
        const registerUseCase = new RegisterUser(repository);

        try {
            const user = await registerUseCase.execute({
                name: 'User 1',
                document: 123456789,
                email: 'user@email.com',
                password: '12341234'
            });
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('User already registered');
        }
    });
});