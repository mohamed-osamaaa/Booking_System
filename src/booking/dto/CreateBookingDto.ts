import { InputType, Field, ID } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBookingDto {
    @Field(() => ID)
    @IsNotEmpty()
    serviceId: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    endDate?: Date;
}
