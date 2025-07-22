import { InputType, Field } from '@nestjs/graphql';
import {
    IsEmail,
    IsStrongPassword,
    MinLength,
} from 'class-validator';

@InputType()
export class userLoginDto {
    @Field()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @Field()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @IsStrongPassword(
        {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol',
        },
    )
    password: string;
}