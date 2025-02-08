import { User } from "@src/auth/domain/entities/user.entity";
import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";

export abstract class AuthRepository {
    abstract registerUser(registerUserDto: RegisterUserDto): Promise<User>;
}