import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommercialAssistantDto {
  @IsString({ message: 'The name must be string' })
  @ApiProperty({
    example: 'Vitória Pâmela',
    description: 'Name of Commercial Assistant',
  })
  name: string;

  @IsString({ message: 'The email must be string' })
  @ApiProperty({
    example: 'vitoria@emai.com',
    description: 'Email of Commercial Assistant',
  })
  email: string;

  @IsString({ message: 'The phone must be string' })
  @ApiProperty({
    example: '84987739980',
    description: 'Format of phone',
  })
  phone: string;
}
