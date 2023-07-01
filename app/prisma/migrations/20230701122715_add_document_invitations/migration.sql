-- CreateTable
CREATE TABLE "DocumentInvitation" (
    "id" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentInvitation_id_key" ON "DocumentInvitation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentInvitation_documentId_userId_key" ON "DocumentInvitation"("documentId", "userId");

-- AddForeignKey
ALTER TABLE "DocumentInvitation" ADD CONSTRAINT "DocumentInvitation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentInvitation" ADD CONSTRAINT "DocumentInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
