import { RegisterUserDto } from "@src/auth/domain/dtos/registerUser.dto";
import { User } from "@src/auth/domain/entities/user.entity";
import { IAuthRepository } from "@src/auth/domain/interfaces/auth.interface";
import { CustomError } from "@src/common/errors/custom.error";

export class MysqlAuthRepository implements IAuthRepository {

    async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
        const { name, document, email, password } = registerUserDto;
        try {
            return new User(
                '1',
                name,
                document,
                email,
                password,
                true,
                'User'
            );
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(error.message);
        }
    }
}