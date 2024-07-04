import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTable1719406369770 implements MigrationInterface {
  name = 'GenerateTable1719406369770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "price" money NOT NULL, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "price" money NOT NULL, "onPurchaseId" uuid, CONSTRAINT "REL_7bd5c184b6ddbed648b0848a3f" UNIQUE ("onPurchaseId"), CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_usertype_enum" AS ENUM('PASSWORD', 'OAUTH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "username" character varying(255) NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "roles" text NOT NULL DEFAULT 'DEFAULT', "password" character varying(255) NOT NULL, "userType" "public"."users_usertype_enum" NOT NULL DEFAULT 'PASSWORD', "picture" text, "discountId" uuid, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_1c05e6df51a57e9f228f778cb2" UNIQUE ("discountId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "title" character varying NOT NULL, "dateOfPublished" character varying NOT NULL, "category" character varying, "userId" uuid, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchases_books_books" ("purchasesId" uuid NOT NULL, "booksId" uuid NOT NULL, CONSTRAINT "PK_f3d5e4856774d0746653a2ff33a" PRIMARY KEY ("purchasesId", "booksId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3006b96f828ec106e4792085a" ON "purchases_books_books" ("purchasesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd78fd35b910005a63d75339a6" ON "purchases_books_books" ("booksId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" ADD CONSTRAINT "FK_7bd5c184b6ddbed648b0848a3fa" FOREIGN KEY ("onPurchaseId") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_1c05e6df51a57e9f228f778cb26" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_bb8627d137a861e2d5dc8d1eb20" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases_books_books" ADD CONSTRAINT "FK_f3006b96f828ec106e4792085a7" FOREIGN KEY ("purchasesId") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases_books_books" ADD CONSTRAINT "FK_bd78fd35b910005a63d75339a6e" FOREIGN KEY ("booksId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchases_books_books" DROP CONSTRAINT "FK_bd78fd35b910005a63d75339a6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases_books_books" DROP CONSTRAINT "FK_f3006b96f828ec106e4792085a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_bb8627d137a861e2d5dc8d1eb20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_1c05e6df51a57e9f228f778cb26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" DROP CONSTRAINT "FK_7bd5c184b6ddbed648b0848a3fa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bd78fd35b910005a63d75339a6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3006b96f828ec106e4792085a"`,
    );
    await queryRunner.query(`DROP TABLE "purchases_books_books"`);
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_usertype_enum"`);
    await queryRunner.query(`DROP TABLE "discounts"`);
    await queryRunner.query(`DROP TABLE "purchases"`);
  }
}
