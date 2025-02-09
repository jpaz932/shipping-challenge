import { User } from "@src/auth/domain/entities/user.entity";
import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";
import { LoginDto } from "@src/auth/domain/dtos/login.dto";

export abstract class AuthRepository {
    abstract login(loginDto: LoginDto): Promise<User>;
    abstract registerUser(registerUserDto: RegisterUserDto): Promise<User>;
}