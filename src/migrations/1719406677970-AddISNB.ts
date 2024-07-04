import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddISNB1719406677970 implements MigrationInterface {
  name = 'AddISNB1719406677970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" ADD "isbn" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "isbn"`);
  }
}
