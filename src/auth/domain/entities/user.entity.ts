export class User {
    constructor(
        public id: number,
        public name: string,
        public document: number,
        public email: string,
        public password: string,
        public role: string,
        public is_active: boolean,
    ) {}
}
