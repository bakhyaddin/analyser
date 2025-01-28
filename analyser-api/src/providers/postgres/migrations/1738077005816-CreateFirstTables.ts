import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFirstTables1738077005816 implements MigrationInterface {
    name = 'CreateFirstTables1738077005816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "object_id" character varying NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "merchants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "category" character varying NOT NULL, "sub_category" character varying, "confidence" real NOT NULL, "is_subscription" boolean NOT NULL DEFAULT false, "flags" character varying NOT NULL, "analysis_id" uuid, CONSTRAINT "PK_4fd312ef25f8e05ad47bfe7ed25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "analyses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_id" uuid, CONSTRAINT "REL_71a5efb5722e52008b7d4dd09e" UNIQUE ("file_id"), CONSTRAINT "PK_91421900ca225ed9865d016a940" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patterns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "merchant" character varying NOT NULL, "amount" numeric NOT NULL, "frequency" character varying, "confidence" real NOT NULL, "next_expected" date, "analysis_id" uuid, CONSTRAINT "PK_afb8e3087247ebfc0f30a682a9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_660ce97c099da0312e7425db831" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "analyses" ADD CONSTRAINT "FK_71a5efb5722e52008b7d4dd09ee" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patterns" ADD CONSTRAINT "FK_9354a8063f12232bfa7871888f1" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patterns" DROP CONSTRAINT "FK_9354a8063f12232bfa7871888f1"`);
        await queryRunner.query(`ALTER TABLE "analyses" DROP CONSTRAINT "FK_71a5efb5722e52008b7d4dd09ee"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_660ce97c099da0312e7425db831"`);
        await queryRunner.query(`DROP TABLE "patterns"`);
        await queryRunner.query(`DROP TABLE "analyses"`);
        await queryRunner.query(`DROP TABLE "merchants"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
