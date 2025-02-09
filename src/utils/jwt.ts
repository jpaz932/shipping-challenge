import { envs } from '@src/config/envs';
import jwt from 'jsonwebtoken';

export class JwtAdapter {
    static async generateToken(payload: Object): Promise<string|null> {
        return new Promise((resolve) => {
            jwt.sign(payload, envs.jwtSecret, { expiresIn: 60 * 60 * 24 }, (err, token) => {
                if (err) return resolve(null);
                resolve(token!);
            });
        })
    }

    static async verifyToken<T>(token: string): Promise<T|null> {
        return new Promise((resolve) => {
            jwt.verify(token, envs.jwtSecret, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded as T);
            });
        });
    }
}