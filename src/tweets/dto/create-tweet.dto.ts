import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTweetDto{
    
    @IsString()
    @MaxLength(280) // spored 2026 standardi na X za tweet max lenght
    content: string;

    @IsOptional()
    @IsString()
    image?: string;

}