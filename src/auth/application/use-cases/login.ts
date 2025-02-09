import { AuthRepository } from "@src/auth/domain/repositories/auth.repository";
import { CustomError } from "@src/common/errors/custom.error";
import { JwtAdapter } from "@src/utils/jwt";
import { SignToken, UserToken } from "@src/auth/application/interfaces";
import { LoginDto } from "@src/auth/domain/dtos/login.dto";

interface LoginUserUseCase {
    execute(loginDto: LoginDto): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdapter.generateToken
    ) {}

    async execute(loginDto: LoginDto): Promise<UserToken> {
        const user = await this.authRepository.login(loginDto);
        const token = await this.signToken({ id: user.id });

        if (!token) throw CustomError.internalServerError('Error generating token');
        return {
            token,
            user: { 
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
} 