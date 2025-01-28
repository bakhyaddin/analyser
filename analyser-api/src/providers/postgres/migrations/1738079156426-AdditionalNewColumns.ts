import { MigrationInterface, QueryRunner } from "typeorm";

export class AdditionalNewColumns1738079156426 implements MigrationInterface {
    name = 'AdditionalNewColumns1738079156426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patterns" ADD "notes" character varying`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD "original_name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "original_name"`);
        await queryRunner.query(`ALTER TABLE "patterns" DROP COLUMN "notes"`);
    }

}
