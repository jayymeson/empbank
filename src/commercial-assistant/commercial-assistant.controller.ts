import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CommercialAssistantService } from './commercial-assistant.service';
import { CommercialAssistant } from './models/interface/commercialAssistant.interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CommercialAssistantDto } from './models/dto/create-commercialAssistant.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('commercial-assistant')
export class CommercialAssistantController {
  constructor(
    private readonly commercialAssistantService: CommercialAssistantService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Commercial assistant created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Email or phone already exists',
  })
  async create(
    @Body() commercialAssistantDto: CommercialAssistantDto,
  ): Promise<CommercialAssistant> {
    try {
      return await this.commercialAssistantService.create(
        commercialAssistantDto,
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          let message = 'Conflict error';
          if (error.meta && typeof error.meta.target === 'string') {
            const target = error.meta.target;
            message = `Commercial Assistant with this ${target} already exists.`;
          } else if (error.meta && Array.isArray(error.meta.target)) {
            const target = error.meta.target.join(', ');
            message = `Commercial Assistant with this ${target} already exists.`;
          }
          throw new ConflictException(message);
        }
      }
      throw error;
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Commercial assistants found successfully',
  })
  @ApiResponse({ status: 404, description: 'No commercial assistants found' })
  findAll(): Promise<CommercialAssistant[]> {
    return this.commercialAssistantService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Commercial assistant found successfully',
  })
  @ApiResponse({ status: 404, description: 'Commercial assistant not found' })
  findById(@Param('id') id: string): Promise<CommercialAssistant | null> {
    return this.commercialAssistantService.findById(id);
  }
}
