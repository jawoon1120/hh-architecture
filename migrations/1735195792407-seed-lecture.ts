import { MigrationInterface, QueryRunner } from 'typeorm';
import { SCHEDULE_STATUS } from '../src/lecture/domain/schedule-status.enum';

export class SeedLecture1735195792407 implements MigrationInterface {
  name = 'SeedLecture1735195792407';

  lectures = [
    {
      title: '경제학 기초',
      instructor: '슈카 월드',
    },
    {
      title: 'AI 기초 with Python',
      instructor: '일론 머스크',
    },
  ];

  schedules = [
    {
      startTime: '10:00:00',
      endTime: '12:00:00',
    },
    {
      startTime: '13:00:00',
      endTime: '15:00:00',
    },
    {
      startTime: '16:00:00',
      endTime: '18:00:00',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.lectures.forEach(async (lecture) => {
      // 강의 데이터 삽입
      await queryRunner.query(`
      INSERT INTO lecture (title, instructor, created_at, updated_at)
      VALUES ('${lecture.title}', '${lecture.instructor}', NOW(), NOW())
    `);

      // 방금 삽입한 강의의 ID 가져오기
      const [addedlecture] = await queryRunner.query(`
      SELECT id FROM lecture WHERE instructor = '${lecture.instructor}' LIMIT 1
    `);
      const lectureId = addedlecture.id;

      // 4월의 모든 토요일 날짜 생성
      const saturdays = this.getSaturdays(2025, 1);

      // 각 토요일마다 3개의 시간대 스케줄 생성
      saturdays.forEach((saturday) => {
        this.schedules.forEach(async (schedule) => {
          await queryRunner.query(
            this.getScheduleInsertQuery(lectureId, saturday, schedule),
          );
        });
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 생성한 스케줄 삭제
    await queryRunner.query(`
      DELETE FROM schedule WHERE lecture_id IN (
        SELECT id FROM lecture WHERE instructor = '정자운'
      )
    `);

    // 생성한 강의 삭제
    await queryRunner.query(`
      DELETE FROM lecture WHERE instructor = '정자운'
    `);
  }

  private getSaturdays(year: number, month: number): string[] {
    const saturdays: string[] = [];

    const date = new Date(year, month - 1, 1);
    while (date.getMonth() === month - 1) {
      // 토요일(6)인 경우
      if (date.getDay() === 6) {
        // 토요일이면
        saturdays.push(date.toISOString().split('T')[0]);
      }
      date.setDate(date.getDate() + 1);
    }
    date.setDate(date.getDate() + 1);
    return saturdays;
  }

  private getScheduleInsertQuery(
    lectureId: number,
    saturday: string,
    schedule: { startTime: string; endTime: string },
  ): string {
    return `
          INSERT INTO schedule (
            lecture_id,
            lecture_started_at,
            lecture_ended_at,
            enrollment_capacity,
            current_enrollment_count,
            status,
            created_at,
            updated_at
          )
          VALUES (
            ${lectureId},
            '${saturday} ${schedule.startTime}',
            '${saturday} ${schedule.endTime}',
            30,
            0,
            '${SCHEDULE_STATUS.OPEN_SEATS}',
            NOW(),
            NOW()
          )
        `;
  }
}
