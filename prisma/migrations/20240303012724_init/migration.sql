-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "commercialAssistantId" INTEGER,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial_assistants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "commercial_assistants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_code_key" ON "customers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_assistants_email_key" ON "commercial_assistants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_assistants_phone_key" ON "commercial_assistants"("phone");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_commercialAssistantId_fkey" FOREIGN KEY ("commercialAssistantId") REFERENCES "commercial_assistants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
