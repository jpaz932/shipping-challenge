import { User } from '@src/auth/domain/entities/user.entity';
import { CustomError } from '@src/common/errors/custom.error';

export class UserMapper {
    static userEntityFromObject(object: { [key: string]: any }) {
        const { id, name, document, email, password, role, is_active } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!document) throw CustomError.badRequest('Missing document');
        if (!email) throw CustomError.badRequest('Missing email');
        if (!role) throw CustomError.badRequest('Missing role');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return new User(id, name, document, email, password, role, is_active);
    }
}
