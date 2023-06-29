import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionGateway } from './subscription.gateway';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionGateway', () => {
  let gateway: SubscriptionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionGateway, SubscriptionService],
    }).compile();

    gateway = module.get<SubscriptionGateway>(SubscriptionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
