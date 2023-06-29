import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { DocumentSubscriptionService } from './document-subscription.service';
import { CreateDocumentSubscriptionDto } from './dto/create-document-subscription.dto';
import { UpdateDocumentSubscriptionDto } from './dto/update-document-subscription.dto';

@WebSocketGateway()
export class DocumentSubscriptionGateway {
  constructor(private readonly documentSubscriptionService: DocumentSubscriptionService) {}

  @SubscribeMessage('createDocumentSubscription')
  create(@MessageBody() createDocumentSubscriptionDto: CreateDocumentSubscriptionDto) {
    return this.documentSubscriptionService.create(createDocumentSubscriptionDto);
  }

  @SubscribeMessage('findAllDocumentSubscription')
  findAll() {
    return this.documentSubscriptionService.findAll();
  }

  @SubscribeMessage('findOneDocumentSubscription')
  findOne(@MessageBody() id: number) {
    return this.documentSubscriptionService.findOne(id);
  }

  @SubscribeMessage('updateDocumentSubscription')
  update(@MessageBody() updateDocumentSubscriptionDto: UpdateDocumentSubscriptionDto) {
    return this.documentSubscriptionService.update(updateDocumentSubscriptionDto.id, updateDocumentSubscriptionDto);
  }

  @SubscribeMessage('removeDocumentSubscription')
  remove(@MessageBody() id: number) {
    return this.documentSubscriptionService.remove(id);
  }
}
