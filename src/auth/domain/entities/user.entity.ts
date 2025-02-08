export class User {
    constructor(
        public id: string,
        public name: string,
        public document: number,
        public email: string,
        public password: string,
        public status: boolean,
        public role: string,
    ) {}
}