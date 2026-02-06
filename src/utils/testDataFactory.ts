import { faker } from '@faker-js/faker';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    zipCode: string;
}

export type InvalidEmailType =
    | 'no_at'
    | 'no_domain'
    | 'missing_tld'
    | 'double_at'
    | 'leading_dot'
    | 'trailing_dot'
    | 'too_long'
    | 'special_chars';


export type InvalidPasswordType =
    | 'too_short'
    | 'spaces_only'
    | 'no_uppercase'
    | 'no_lowercase'
    | 'no_number'
    | 'no_special_char'
    | 'only_numbers'
    | 'only_letters'
    | 'contains_space'
    | 'too_long'
    | 'empty';


export class TestDataFactory {
    static generateAccountInformation(): any {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: '12345678',
            address1: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            mobileNumber: faker.string.numeric({ length: 10 }),
            zipcode: faker.location.zipCode(),
        };
    }

    static generateProductName(): string {
        return `Test Product ${faker.number.int({ min: 1000, max: 9999 })}`;
    }
    static generateEmail(): string {
        return faker.internet.email();
    }

    static randomNumber(min: number = 1, max: number = 100): number {
        return faker.number.int({ min, max });
    }

    static generateInvalidEmail(type: InvalidEmailType): string {
        const name = faker.person.firstName().toLowerCase();

        switch (type) {
            case 'no_at': return `${name}gmail.com`;
            case 'no_domain': return `${name}@`;
            case 'missing_tld': return `${name}@gmail`;
            case 'double_at': return `${name}@@gmail.com`;
            case 'leading_dot': return `.${name}@gmail.com`;
            case 'trailing_dot': return `${name}.@gmail.com`;
            case 'too_long': return `${'a'.repeat(320)}@example.com`;
            case 'special_chars': return `${name}@do#main.com`;
            default: return 'not-an-email';
        }
    }

    static generateInvalidPassword(type: InvalidPasswordType): string {
        switch (type) {
            case 'too_short': return faker.string.alphanumeric(5);
            // lowercase + number + special (no uppercase)
            case 'no_uppercase': return faker.string.alpha({ length: 8, casing: 'lower' }) + '1!';
            // uppercase + number + special (no lowercase)
            case 'no_lowercase': return faker.string.alpha({ length: 8, casing: 'upper' }) + '1!';
            case 'no_number': return faker.string.alpha({ length: 10 }) + '!';
            case 'no_special_char': return faker.string.alphanumeric(10);
            case 'only_numbers': return faker.string.numeric(10);
            case 'only_letters': return faker.string.alpha(10);
            case 'contains_space': return 'Pass word1!';
            case 'spaces_only': return ' '.repeat(10);
            case 'too_long': return 'A1!' + 'a'.repeat(300);
            case 'empty': return '';
            default:
                return 'invalid';
        }
    }
}
