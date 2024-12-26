import { Base } from '@domain/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SCHEDULE_STATUS } from './schedule-status.enum';
import { Lecture } from './lecture.entity';
import { Enrollment } from '@src/enrollment/domain/enrollment.entity';

@Entity({ name: 'schedule' })
export class Schedule extends Base {
  constructor(schedule?: Partial<Schedule>) {
    super();
    if (schedule) {
      Object.assign(this, schedule);
    }
  }

  @ManyToOne(() => Lecture, (lecture) => lecture.schedules)
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;
  @Column()
  lectureId: number;

  @Column()
  lectureStartedAt: Date;

  @Column()
  lectureEndedAt: Date;

  @Column({ type: 'integer' })
  enrollmentCapacity: number;

  @Column({ type: 'integer' })
  currentEnrollmentCount: number;

  @Column({ type: 'varchar' })
  status: SCHEDULE_STATUS;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.schedule)
  enrollments: Enrollment[];
}
