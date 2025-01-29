import { MigrationInterface, QueryRunner } from "typeorm";

export class AnalysisCascadeForMerhandAndPattern1738188514356 implements MigrationInterface {
    name = 'AnalysisCascadeForMerhandAndPattern1738188514356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_660ce97c099da0312e7425db831"`);
        await queryRunner.query(`ALTER TABLE "patterns" DROP CONSTRAINT "FK_9354a8063f12232bfa7871888f1"`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_660ce97c099da0312e7425db831" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patterns" ADD CONSTRAINT "FK_9354a8063f12232bfa7871888f1" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patterns" DROP CONSTRAINT "FK_9354a8063f12232bfa7871888f1"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_660ce97c099da0312e7425db831"`);
        await queryRunner.query(`ALTER TABLE "patterns" ADD CONSTRAINT "FK_9354a8063f12232bfa7871888f1" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_660ce97c099da0312e7425db831" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
