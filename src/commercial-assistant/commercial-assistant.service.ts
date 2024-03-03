import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommercialAssistantDto } from './models/dto/create-commercialAssistant.dto';
import { CommercialAssistant } from './models/interface/commercialAssistant.interface';

@Injectable()
export class CommercialAssistantService {
  constructor(private prisma: PrismaService) {}

  async create(data: CommercialAssistantDto): Promise<CommercialAssistant> {
    data.phone = this.formatPhone(data.phone);

    const commercialAssistant = await this.prisma.commercialAssistant.create({
      data: {
        ...data,
      },
    });
    return commercialAssistant;
  }

  formatPhone(phone: string): string {
    if (!phone.startsWith('+55')) {
      return `+55${phone}`;
    }
    return phone;
  }

  async findAll(query?: string): Promise<CommercialAssistant[]> {
    let whereCondition = {};

    if (query) {
      whereCondition = {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      };
    }

    const commercialAssistants = await this.prisma.commercialAssistant.findMany(
      {
        where: whereCondition,
        include: {
          Customers: true,
        },
      },
    );

    return commercialAssistants;
  }
}
