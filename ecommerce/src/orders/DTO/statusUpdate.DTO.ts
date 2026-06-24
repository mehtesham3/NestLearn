import { IsIn, IsString } from "class-validator";

export class statusUpdateDTO {

    @IsString()
    @IsIn(['shipped', 'delivered', 'cancelled'])
    status: string;
}