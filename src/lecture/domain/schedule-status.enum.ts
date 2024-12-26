const SCHEDULE_STATUS = {
  FULL: 'full',
  OPEN_SEATS: 'open_seats',
} as const;
type SCHEDULE_STATUS = (typeof SCHEDULE_STATUS)[keyof typeof SCHEDULE_STATUS];

export { SCHEDULE_STATUS };
