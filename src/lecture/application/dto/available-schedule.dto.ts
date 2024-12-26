export interface AvailableScheduleDto {
  id: number;
  lectureStartedAt: Date;
  lectureEndedAt: Date;
  enrollmentCapacity: number;
  enrollmentCount: number;
  lecture: {
    title: string;
    instructor: string;
  };
  disabled: boolean;
}
