interface IDateProvider {
  addDays(days: number): Date;
  addHours(hours: number): Date;
  compareIfBefore(startDate: Date, endDate: Date): boolean;
  convertToUTC(date: Date): string;
  getTodaysDate(): Date;
  getHoursDiff(startDate: Date, endDate: Date): number;
  getDaysDiff(startDate: Date, endDate: Date): number;
}

export { IDateProvider };
