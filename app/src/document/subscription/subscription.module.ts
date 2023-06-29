import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionGateway } from './subscription.gateway';

@Module({
  providers: [SubscriptionGateway, SubscriptionService]
})
export class SubscriptionModule {}
