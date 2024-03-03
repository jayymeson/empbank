import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UnlinkCustomersDto {
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @ApiProperty({
    example: ['uuid-customer-1', 'uuid-customer-2'],
    description: 'Array of Customer IDs',
  })
  customerIds: string[];
}
