import {MigrationInterface, QueryRunner} from "typeorm";

export class TransactionHistoryRefactoring1641041067784 implements MigrationInterface {
    name = 'TransactionHistoryRefactoring1641041067784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD "walletId" integer`);
        await queryRunner.query(`ALTER TABLE "address_contact" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD CONSTRAINT "FK_8bdc31e84262ee1bbfcb63ab257" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD CONSTRAINT "FK_e57f3faa2f5150f18baf9a96926" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address_contact" ADD CONSTRAINT "FK_1821fec45c58656d29b9912ec08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address_contact" DROP CONSTRAINT "FK_1821fec45c58656d29b9912ec08"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP CONSTRAINT "FK_e57f3faa2f5150f18baf9a96926"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP CONSTRAINT "FK_8bdc31e84262ee1bbfcb63ab257"`);
        await queryRunner.query(`ALTER TABLE "address_contact" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP COLUMN "walletId"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP COLUMN "userId"`);
    }

}
