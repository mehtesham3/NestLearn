import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class statusUpdateDTO {
    @ApiProperty({ example: 'shipped', description: 'Order status', required: true, enum: ['shipped', 'delivered', 'cancelled'] })
    @IsString()
    @IsNotEmpty()
    @IsIn(['shipped', 'delivered', 'cancelled'])
    status: string;
}