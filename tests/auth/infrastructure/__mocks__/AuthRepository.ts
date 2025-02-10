import { User } from '@src/auth/domain/entities/user.entity';
import { RegisterUserDto } from '@src/auth/domain/dtos/registerUser.dto';
import { LoginDto } from '@src/auth/domain/dtos/login.dto';
import { CustomError } from '@src/common/errors/custom.error';

export class AuthRepository {
    private users: User[] = [
        new User(
            1,
            'User 1',
            123456789,
            'user@email.com',
            '12341234',
            'User',
            true,
        ),
    ];

    async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
        const user = new User(
            this.users.length + 1,
            registerUserDto.name,
            registerUserDto.document,
            registerUserDto.email,
            registerUserDto.password,
            'User',
            true,
        );
        this.users.push(user);
        return Promise.resolve(user);
    }

    async login(loginDto: LoginDto): Promise<User> {
        const user = this.users.find(
            (user) =>
                user.email === loginDto.email &&
                user.password === loginDto.password,
        );
        if (!user) {
            throw CustomError.unauthorized('Wrong email or password');
        }
        return Promise.resolve(user);
    }
}
