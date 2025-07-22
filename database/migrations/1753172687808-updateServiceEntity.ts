import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceEntity1753172687808 implements MigrationInterface {
    name = 'UpdateServiceEntity1753172687808';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE \`service\`
        ADD \`images\` text NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE \`service\`
        DROP COLUMN \`images\`
        `);
    }
}