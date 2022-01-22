-- CreateEnum
CREATE TYPE "configType" AS ENUM ('SYSTEM_DEFAULT', 'USER_CONFIG');

-- CreateTable
CREATE TABLE "EntryConfig" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "configType" NOT NULL,
    "ownerId" TEXT,
    "json" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntryConfig_ownerId_unique" ON "EntryConfig"("ownerId");

-- AddForeignKey
ALTER TABLE "EntryConfig" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
