import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { CommercialAssistantModule } from './commercial-assistant/commercial-assistant.module';

@Module({
  imports: [CustomerModule, CommercialAssistantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
