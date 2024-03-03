import { Module } from '@nestjs/common';
import { CustomersService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [CustomersService],
})
export class CustomerModule {}
