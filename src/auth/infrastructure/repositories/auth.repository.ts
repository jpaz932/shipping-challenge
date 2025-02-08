import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";
import { User } from "@src/auth/domain/entities/user.entity";
import { IAuthRepository } from "@src/auth/domain/interfaces/auth.interface";
import { AuthRepository } from "@src/auth/domain/repositories/auth.repository";

export class AuthRepositoryImpl implements IAuthRepository {
    constructor(private readonly authDatasourceRepository: AuthRepository) {}

    registerUser(registerUserDto: RegisterUserDto): Promise<User> {
        return this.authDatasourceRepository.registerUser(registerUserDto);
    }

}