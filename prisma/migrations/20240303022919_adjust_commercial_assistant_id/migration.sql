/*
  Warnings:

  - The primary key for the `commercial_assistants` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_commercialAssistantId_fkey";

-- AlterTable
ALTER TABLE "commercial_assistants" DROP CONSTRAINT "commercial_assistants_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "commercial_assistants_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "commercial_assistants_id_seq";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "commercialAssistantId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_commercialAssistantId_fkey" FOREIGN KEY ("commercialAssistantId") REFERENCES "commercial_assistants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
