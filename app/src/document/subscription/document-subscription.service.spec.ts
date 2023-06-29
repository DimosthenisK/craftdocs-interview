import { Test, TestingModule } from '@nestjs/testing';
import { DocumentSubscriptionService } from './document-subscription.service';

describe('DocumentSubscriptionService', () => {
  let service: DocumentSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentSubscriptionService],
    }).compile();

    service = module.get<DocumentSubscriptionService>(DocumentSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
