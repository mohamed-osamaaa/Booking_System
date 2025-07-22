import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

@InputType()
export class CreateServiceDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  // @Field(() => [String], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // images?: string[];

  @Field(() => [GraphQLUpload], { nullable: true })
  @IsOptional()
  images?: Promise<FileUpload[]>; // GraphQLUpload
}
