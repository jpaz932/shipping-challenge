import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
} from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    document: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    password: string;
}
