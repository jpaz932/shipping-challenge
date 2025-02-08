import { User } from "@src/auth/domain/entities/user.entity";
import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";

export interface IAuthRepository {
    registerUser(registerUser: RegisterUserDto): Promise<User>;
}