/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `admin_users` (
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `employment_status` VARCHAR(191) NOT NULL,
    `forename` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `department_code` VARCHAR(191) NOT NULL,
    `job_title_code` VARCHAR(191) NOT NULL,
    `app_password` VARCHAR(191) NOT NULL,
    `app_privileges` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `admin_users_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
