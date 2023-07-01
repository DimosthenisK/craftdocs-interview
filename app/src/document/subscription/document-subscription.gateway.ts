import { DocumentSubscriptionService } from './document-subscription.service';
import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class DocumentSubscriptionGateway {
  constructor(
    private readonly documentSubscriptionService: DocumentSubscriptionService,
  ) {}
}
