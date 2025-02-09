export type SignToken = (payload: Object) => Promise<string | null>;

export interface UserToken {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}