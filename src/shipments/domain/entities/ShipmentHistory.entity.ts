export type ShipmentHistoryItem = {
    status: string;
    created_at: Date;
};

export class ShipmentHistory {
    constructor(
        public readonly tracking_code: string,
        public readonly origin_city: string,
        public readonly destination_city: string,
        public readonly history: ShipmentHistoryItem[],
    ) {}
}
