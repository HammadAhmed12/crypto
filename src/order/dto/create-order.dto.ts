import { IsNumber, IsString } from "class-validator";
import { isFloat32Array } from "util/types";

export class CreateOrderDto {
    @IsString()
    type: string;

    @IsNumber()
    quantity: Number;

    @IsNumber()
    price: Number
    
}
