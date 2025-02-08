import { User } from "@src/auth/domain/entities/user";
import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";

export interface AuthRepository {
    registerUser(registerUser: RegisterUserDto): Promise<User>;
}