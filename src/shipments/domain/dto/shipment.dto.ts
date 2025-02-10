import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ShipmentDto {
    @IsNumber()
    @IsNotEmpty()
    phone: number;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    dimensions: string;

    @IsString()
    @IsNotEmpty()
    product_type: string;

    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @IsString()
    @IsNotEmpty()
    origin_city: string;

    @IsString()
    @IsNotEmpty()
    destination_city: string;

    @IsOptional()
    userId: number;
}
