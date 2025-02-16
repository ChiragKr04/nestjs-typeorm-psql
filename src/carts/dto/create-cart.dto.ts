import { IsInt, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCartDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsUUID()
  @IsString()
  productId: string;

  @IsNumber()
  @IsInt()
  quantity: number;
}
