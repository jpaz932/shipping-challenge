import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StatusRouteDto {
    @IsNumber()
    @IsNotEmpty()
    routeId: number;

    @IsString()
    @IsNotEmpty()
    @IsIn(['En tránsito', 'Entregado'])
    status: string;
}
