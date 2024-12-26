import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1735193757480 implements MigrationInterface {
  name = 'InitSchema1735193757480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`enrollment\` (\`user_id\` int NOT NULL, \`schedule_id\` int NOT NULL, \`lecture_id\` int NOT NULL, \`enrolled_at\` datetime NOT NULL, PRIMARY KEY (\`user_id\`, \`schedule_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedule\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`lecture_id\` int NOT NULL, \`lecture_started_at\` datetime NOT NULL, \`lecture_ended_at\` datetime NOT NULL, \`enrollment_capacity\` int NOT NULL, \`current_enrollment_count\` int NOT NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lecture\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`title\` varchar(255) NOT NULL, \`instructor\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollment\` ADD CONSTRAINT \`FK_59ab0da14ad48f1170074c5854b\` FOREIGN KEY (\`schedule_id\`) REFERENCES \`schedule\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollment\` ADD CONSTRAINT \`FK_67d5549a11004c5f8ef6451203a\` FOREIGN KEY (\`lecture_id\`) REFERENCES \`lecture\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedule\` ADD CONSTRAINT \`FK_1f33c6a0bf3efaa0b5cf5e54bb3\` FOREIGN KEY (\`lecture_id\`) REFERENCES \`lecture\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`schedule\` DROP FOREIGN KEY \`FK_1f33c6a0bf3efaa0b5cf5e54bb3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollment\` DROP FOREIGN KEY \`FK_67d5549a11004c5f8ef6451203a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollment\` DROP FOREIGN KEY \`FK_59ab0da14ad48f1170074c5854b\``,
    );
    await queryRunner.query(`DROP TABLE \`lecture\``);
    await queryRunner.query(`DROP TABLE \`schedule\``);
    await queryRunner.query(`DROP TABLE \`enrollment\``);
  }
}
