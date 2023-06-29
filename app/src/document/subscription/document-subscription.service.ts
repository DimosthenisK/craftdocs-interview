import { Injectable } from '@nestjs/common';
import { CreateDocumentSubscriptionDto } from './dto/create-document-subscription.dto';
import { UpdateDocumentSubscriptionDto } from './dto/update-document-subscription.dto';

@Injectable()
export class DocumentSubscriptionService {
  create(createDocumentSubscriptionDto: CreateDocumentSubscriptionDto) {
    return 'This action adds a new documentSubscription';
  }

  findAll() {
    return `This action returns all documentSubscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentSubscription`;
  }

  update(id: number, updateDocumentSubscriptionDto: UpdateDocumentSubscriptionDto) {
    return `This action updates a #${id} documentSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentSubscription`;
  }
}
