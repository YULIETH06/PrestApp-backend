/*
  Warnings:

  - You are about to drop the column `pqrId` on the `notification` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `notification` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `notification` DROP COLUMN `pqrId`,
    MODIFY `type` ENUM('GENERAL') NOT NULL DEFAULT 'GENERAL';
