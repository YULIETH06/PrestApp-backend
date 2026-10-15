-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `identificationTypeId` INTEGER NOT NULL,
    `identificationNumber` VARCHAR(30) NOT NULL,
    `fullName` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `secondaryPhone` VARCHAR(20) NULL,
    `address` VARCHAR(200) NOT NULL,
    `neighborhood` VARCHAR(100) NOT NULL,
    `notes` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Client_identificationTypeId_idx`(`identificationTypeId`),
    UNIQUE INDEX `Client_userId_identificationNumber_key`(`userId`, `identificationNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_identificationTypeId_fkey` FOREIGN KEY (`identificationTypeId`) REFERENCES `IdentificationType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
