import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDOI1719491400061 implements MigrationInterface {
  name = 'AddDOI1719491400061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" ADD "doi" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "doi"`);
  }
}
