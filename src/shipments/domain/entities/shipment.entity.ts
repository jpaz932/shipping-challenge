export class Shipment {
    constructor(
        public id: number,
        public user_id: number,
        public phone: number,
        public address: string,
        public dimensions: string,
        public product_type: string,
        public weight: number,
        public status: string,
        public origin_city: string,
        public destination_city: string,
        public created_at: Date,
        public updated_at: Date,
    ) {}
}
