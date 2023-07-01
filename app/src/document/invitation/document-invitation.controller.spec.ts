import { Test, TestingModule } from '@nestjs/testing';
import { DocumentInvitationController } from './document-invitation.controller';
import { DocumentInvitationService } from './document-invitation.service';

describe('DocumentInvitationController', () => {
  let controller: DocumentInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentInvitationController],
      providers: [DocumentInvitationService],
    }).compile();

    controller = module.get<DocumentInvitationController>(DocumentInvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
