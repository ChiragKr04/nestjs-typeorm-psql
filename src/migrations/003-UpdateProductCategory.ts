import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration_003_UpdateProductCategory implements MigrationInterface {
    name = 'UpdateProductCategory1739711046553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "category" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category"`);
    }

}
