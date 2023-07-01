import { Test, TestingModule } from '@nestjs/testing';
import { DocumentInvitationService } from './document-invitation.service';

describe('DocumentInvitationService', () => {
  let service: DocumentInvitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentInvitationService],
    }).compile();

    service = module.get<DocumentInvitationService>(DocumentInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
