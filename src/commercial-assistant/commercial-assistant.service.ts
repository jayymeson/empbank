import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommercialAssistantDto } from './models/dto/create-commercialAssistant.dto';
import { CommercialAssistant } from './models/interface/commercialAssistant.interface';

@Injectable()
export class CommercialAssistantService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new commercial assistant.
   * @param {CommercialAssistantDto} data - Data Transfer Object for creating a commercial assistant.
   * @returns {Promise<CommercialAssistant>} The created commercial assistant object.
   * @author Jaymeson
   */
  async create(data: CommercialAssistantDto): Promise<CommercialAssistant> {
    data.phone = this.formatPhone(data.phone);

    const commercialAssistant = await this.prisma.commercialAssistant.create({
      data: {
        ...data,
      },
    });
    return commercialAssistant;
  }

  /**
   * Formats a phone number to include the country code if missing.
   * @param {string} phone - The phone number to format.
   * @returns {string} The formatted phone number.
   * @author Jaymeson
   */
  formatPhone(phone: string): string {
    if (!phone.startsWith('+55')) {
      return `+55${phone}`;
    }
    return phone;
  }

  /**
   * Finds all commercial assistants.
   * @returns {Promise<CommercialAssistant[]>} An array of commercial assistants.
   * @author Jaymeson
   */
  async findAll(): Promise<CommercialAssistant[]> {
    return this.prisma.commercialAssistant.findMany({
      include: {
        Customers: true,
      },
    });
  }

  /**
   * Finds a commercial assistant by ID.
   * @param {string} id - The ID of the commercial assistant to find.
   * @returns {Promise<CommercialAssistant | null>} The found commercial assistant or null if not found.
   * @author Jaymeson
   */
  async findById(id: string): Promise<CommercialAssistant | null> {
    return this.prisma.commercialAssistant.findUnique({
      where: { id },
      include: {
        Customers: true,
      },
    });
  }
}
