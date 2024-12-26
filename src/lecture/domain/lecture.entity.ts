import { Base } from '@domain/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Enrollment } from '@src/enrollment/domain/enrollment.entity';

@Entity({ name: 'lecture' })
export class Lecture extends Base {
  constructor(lecture?: Partial<Lecture>) {
    super();
    if (lecture) {
      Object.assign(this, lecture);
    }
  }

  @Column()
  title: string;

  @Column()
  instructor: string;

  @OneToMany(() => Schedule, (schedule) => schedule.lecture)
  schedules: Schedule[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.lecture)
  enrollments: Enrollment[];
}
