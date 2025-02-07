-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "parseConfig" JSONB;

-- AlterTable
ALTER TABLE "OptionGroup" ADD COLUMN     "parseConfig" JSONB;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "parseConfig" JSONB;
