import { DateTime } from 'luxon'

export default class DateHelper {
  public static date(date: string, format: string = 'yyyy-MM-dd'): DateTime {
    return DateTime.fromFormat(date, format)
  }

  public static todayDate(format: string = 'yyyy-MM-dd'): DateTime {
    const date = DateTime.local().toFormat(format)
    return DateHelper.date(date, format)
  }

  public static modifyDate(days: number = 0, hours: number = 0, format: string = 'yyyy-MM-dd'): DateTime {
    const date = DateTime.local().plus({ days, hours }).toFormat(format)
    return DateTime.fromFormat(date, format)
  }

  public static getCurrentFinancialYearStart(): string {
    var fiscalYearStart = 0
    var today = this.todayDate()
    if ((today.month + 1) <= 3) {
      fiscalYearStart = today.year - 1
    } else {
      fiscalYearStart = today.year
    }
    return `${fiscalYearStart}-04-01`
  }

  public static getCurrentFinancialYearEnd(): string {
    var fiscalYearStart = 0
    var today = this.todayDate()
    if ((today.month + 1) <= 3) {
      fiscalYearStart = today.year
    } else {
      fiscalYearStart = today.year + 1
    }
    return `${fiscalYearStart}-03-31`
  }
}
