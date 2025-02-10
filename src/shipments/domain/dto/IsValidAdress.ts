/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidAddressConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: any): Promise<boolean> {
        const { object } = args;
        const city = object['destination_city'];

        try {
            const fullAddress = `${value}, ${city}`;
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json`;
            const response = await fetch(url);
            const data = await response.json();
            return data.length > 0;
        } catch {
            return false;
        }
    }

    defaultMessage(): string {
        return 'La dirección y la ciudad no son válidas o no se encontraron en OpenStreetMap.';
    }
}

export function IsValidAddress(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidAddressConstraint,
        });
    };
}
