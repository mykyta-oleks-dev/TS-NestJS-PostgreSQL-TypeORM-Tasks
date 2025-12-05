import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1764919358599 implements MigrationInterface {
	name = 'InitialMigration1764919358599';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "task_labels" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "taskId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d63f0a11a5abfc0883efb374802" UNIQUE ("name", "taskId"), CONSTRAINT "PK_72402f2c22ceabc2e73b718c321" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_b148c8d5eb7df0b134cab11ad2" ON "task_labels" ("taskId") `,
		);
		await queryRunner.query(
			`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'OPEN', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roles" text array NOT NULL DEFAULT '{user}', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "task_labels" ADD CONSTRAINT "FK_b148c8d5eb7df0b134cab11ad2e" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`,
		);
		await queryRunner.query(
			`ALTER TABLE "task_labels" DROP CONSTRAINT "FK_b148c8d5eb7df0b134cab11ad2e"`,
		);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TABLE "tasks"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_b148c8d5eb7df0b134cab11ad2"`,
		);
		await queryRunner.query(`DROP TABLE "task_labels"`);
	}
}
