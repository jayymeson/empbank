import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class LinkCustomersDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['uuid-customer-1', 'uuid-customer-2'],
    description: 'Array of Customer IDs',
  })
  customerIds: string[];

  @IsString()
  @ApiProperty({
    example: 'uuid-assistant',
    description: 'The ID of the Commercial Assistant',
  })
  commercialAssistantId: string;
}
