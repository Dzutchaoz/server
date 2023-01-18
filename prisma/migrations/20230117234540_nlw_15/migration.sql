/*
  Warnings:

  - You are about to drop the column `start_at` on the `habits` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "navys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "creat_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "creat_at" DATETIME NOT NULL
);
INSERT INTO "new_habits" ("creat_at", "id", "title") SELECT "creat_at", "id", "title" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
