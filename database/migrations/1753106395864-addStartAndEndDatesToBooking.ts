import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStartAndEndDatesToBooking1753106395864 implements MigrationInterface {
    name = 'AddStartAndEndDatesToBooking1753106395864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking\` ADD \`startDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD \`endDate\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking\` DROP COLUMN \`endDate\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP COLUMN \`startDate\``);
    }
}
