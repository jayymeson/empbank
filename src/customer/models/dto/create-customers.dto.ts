import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'The code must be string' })
  @Length(3, 20, { message: 'The code must be 5 characters.' })
  @ApiProperty({
    example: 'XX30-2',
    description: 'Format of code',
  })
  code: string;

  @IsString({ message: 'The name must be string' })
  @ApiProperty({
    example: 'Jaymeson Mendes',
    description: 'Name of customers',
  })
  name: string;

  @IsString({ message: 'The network must be string' })
  @ApiProperty({
    example: 'Rede 2',
    description: 'Format of network',
  })
  network: string;
}
