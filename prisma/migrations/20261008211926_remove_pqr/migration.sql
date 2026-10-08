/*
  Warnings:

  - The values [AGENT] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `pqr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pqrchatread` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pqrmessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pqrmessageattachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_pqrId_fkey`;

-- DropForeignKey
ALTER TABLE `pqr` DROP FOREIGN KEY `PQR_assignedToId_fkey`;

-- DropForeignKey
ALTER TABLE `pqr` DROP FOREIGN KEY `PQR_userId_fkey`;

-- DropForeignKey
ALTER TABLE `pqrchatread` DROP FOREIGN KEY `PqrChatRead_pqrId_fkey`;

-- DropForeignKey
ALTER TABLE `pqrchatread` DROP FOREIGN KEY `PqrChatRead_userId_fkey`;

-- DropForeignKey
ALTER TABLE `pqrmessage` DROP FOREIGN KEY `PqrMessage_pqrId_fkey`;

-- DropForeignKey
ALTER TABLE `pqrmessage` DROP FOREIGN KEY `PqrMessage_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `pqrmessageattachment` DROP FOREIGN KEY `PqrMessageAttachment_messageId_fkey`;

-- DropIndex
DROP INDEX `Notification_pqrId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `pqr`;

-- DropTable
DROP TABLE `pqrchatread`;

-- DropTable
DROP TABLE `pqrmessage`;

-- DropTable
DROP TABLE `pqrmessageattachment`;
