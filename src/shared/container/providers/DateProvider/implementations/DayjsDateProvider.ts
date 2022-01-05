import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    const startDateUTC = this.convertToUTC(startDate);
    const endDateUTC = this.convertToUTC(endDate);

    return dayjs(startDateUTC).isBefore(endDateUTC);
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  getTodaysDate(): Date {
    const todaysDate = dayjs().toDate();

    return todaysDate;
  }

  getHoursDiff(startDate: Date, endDate: Date): number {
    const startDateUTC = this.convertToUTC(startDate);
    const endDateUTC = this.convertToUTC(endDate);

    return dayjs(endDateUTC).diff(startDateUTC, "hours");
  }

  getDaysDiff(startDate: Date, endDate: Date): number {
    const startDateUTC = this.convertToUTC(startDate);
    const endDateUTC = this.convertToUTC(endDate);

    return dayjs(endDateUTC).diff(startDateUTC, "days");
  }
}

export { DayjsDateProvider };
