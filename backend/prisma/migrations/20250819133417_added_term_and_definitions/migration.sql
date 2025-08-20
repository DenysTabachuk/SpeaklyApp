-- CreateTable
CREATE TABLE "public"."Term" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Definition" (
    "id" SERIAL NOT NULL,
    "termId" INTEGER NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Definition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Term" ADD CONSTRAINT "Term_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Definition" ADD CONSTRAINT "Definition_termId_fkey" FOREIGN KEY ("termId") REFERENCES "public"."Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;
