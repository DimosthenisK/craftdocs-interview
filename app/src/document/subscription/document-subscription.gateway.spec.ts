import { Test, TestingModule } from '@nestjs/testing';
import { DocumentSubscriptionGateway } from './document-subscription.gateway';
import { DocumentSubscriptionService } from './document-subscription.service';

describe('DocumentSubscriptionGateway', () => {
  let gateway: DocumentSubscriptionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentSubscriptionGateway, DocumentSubscriptionService],
    }).compile();

    gateway = module.get<DocumentSubscriptionGateway>(DocumentSubscriptionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
