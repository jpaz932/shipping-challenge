import { compareSync, hashSync } from 'bcryptjs';

export class BcryptAdapter {
    public static hash(password: string): string {
        return hashSync(password);
    }

    public static compare(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }
}
