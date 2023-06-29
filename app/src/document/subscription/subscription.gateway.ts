import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@WebSocketGateway()
export class SubscriptionGateway {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @SubscribeMessage('createSubscription')
  create(@MessageBody() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @SubscribeMessage('findAllSubscription')
  findAll() {
    return this.subscriptionService.findAll();
  }

  @SubscribeMessage('findOneSubscription')
  findOne(@MessageBody() id: number) {
    return this.subscriptionService.findOne(id);
  }

  @SubscribeMessage('updateSubscription')
  update(@MessageBody() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(updateSubscriptionDto.id, updateSubscriptionDto);
  }

  @SubscribeMessage('removeSubscription')
  remove(@MessageBody() id: number) {
    return this.subscriptionService.remove(id);
  }
}
