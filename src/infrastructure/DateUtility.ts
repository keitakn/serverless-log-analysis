import * as moment from "moment-timezone";

export interface IFormattedDate {
  /**
   * YYYY e.g. YYYY "2018"
   */
  year: string;
  /**
   * MM e.g. "09"
   */
  month: string;
  /**
   * DD e.g. "01"
   */
  day: string;
}

/**
 * DateParseError
 *
 * @author keita-koga
 * @since 2018-08-06
 */
export class DateParseError extends Error {
  /**
   * @param {string} message
   */
  constructor(
    message: string = "Invalid Date format. Please set to YYYY-MM-DD."
  ) {
    super(message);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * DateUtility
 *
 * @author keita-koga
 * @since 2018-08-06
 */
export default class DateUtility {
  /**
   * @return {IFormattedDate}
   */
  public static nowDate(): IFormattedDate {
    const momentObject = DateUtility.nowDateInMomentObject();

    return {
      year: momentObject.format("YYYY"),
      month: momentObject.format("MM"),
      day: momentObject.format("DD")
    };
  }

  /**
   * @return {moment.Moment}
   */
  public static nowDateInMomentObject(
    timezone: string = "Asia/Tokyo"
  ): moment.Moment {
    return moment().tz(timezone);
  }

  /**
   * @param {string} date
   * @return {IFormattedDate}
   */
  public static specifiedDate(date: string): IFormattedDate {
    const momentObject = DateUtility.specifiedDateInMomentObject(date);

    return {
      year: momentObject.format("YYYY"),
      month: momentObject.format("MM"),
      day: momentObject.format("DD")
    };
  }

  /**
   * @param {string} date
   * @param {string} timezone
   * @return {moment.Moment}
   */
  public static specifiedDateInMomentObject(
    date: string,
    timezone: string = "Asia/Tokyo"
  ): moment.Moment {
    const momentObject = moment(date).tz(timezone);

    if (!momentObject.isValid()) {
      throw new DateParseError();
    }

    return momentObject;
  }

  /**
   * @param {string} fromDate
   * @param {string} toDate
   * @return {IFormattedDate[]}
   */
  public static betweenFormattedDate(fromDate: string, toDate: string) {
    const dateDiff = DateUtility.dateDiff(fromDate, toDate);

    if (DateUtility.dateDiff(fromDate, toDate) < 0) {
      throw new DateParseError();
    }

    const beginDateObject = DateUtility.specifiedDateInMomentObject(fromDate);
    const formattedDateList: IFormattedDate[] = [
      DateUtility.specifiedDate(beginDateObject.format("YYYY-MM-DD"))
    ];

    const beginDate = beginDateObject.format("YYYY-MM-DD");
    for (let i = 1; i <= dateDiff; i += 1) {
      const newDateObject = DateUtility.specifiedDateInMomentObject(beginDate);
      formattedDateList.push(
        DateUtility.specifiedDate(
          newDateObject.add(i, "days").format("YYYY-MM-DD")
        )
      );
    }

    return formattedDateList;
  }

  /**
   * @param {string} fromDate
   * @param {string} toDate
   * @return {number}
   */
  private static dateDiff(fromDate: string, toDate: string): number {
    const fromDateObject = DateUtility.specifiedDateInMomentObject(fromDate);
    const toDateObject = DateUtility.specifiedDateInMomentObject(toDate);

    return toDateObject.diff(fromDateObject, "days");
  }
}
