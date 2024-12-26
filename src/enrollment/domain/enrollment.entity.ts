import { Lecture } from '@src/lecture/domain/lecture.entity';
import { Schedule } from '@src/lecture/domain/schedule.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'enrollment' })
export class Enrollment {
  constructor(enrollment?: Partial<Enrollment>) {
    if (enrollment) {
      Object.assign(this, enrollment);
    }
  }

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.enrollments)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
  @PrimaryColumn()
  scheduleId: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.enrollments)
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;
  @Column()
  lectureId: number;

  @Column()
  enrolledAt: Date;
}
