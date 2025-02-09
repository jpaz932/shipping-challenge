import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";
import { AuthRepository } from "@src/auth/domain/repositories/auth.repository";
import { CustomError } from "@src/common/errors/custom.error";
import { JwtAdapter } from "@src/utils/jwt";
import { SignToken, UserToken } from "@src/auth/application/interfaces";


interface RegisterUserUseCase {
    execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdapter.generateToken
    ) {}

    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
        const user = await this.authRepository.registerUser(registerUserDto);
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