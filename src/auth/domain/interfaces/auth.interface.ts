import { User } from '@src/auth/domain/entities/user.entity';
import { RegisterUserDto } from '@src/auth/domain/dtos/registerUser.dto';
import { LoginDto } from '@src/auth/domain/dtos/login.dto';

export interface IAuthRepository {
    login(loginDto: LoginDto): Promise<User>;
    registerUser(registerUser: RegisterUserDto): Promise<User>;
}
