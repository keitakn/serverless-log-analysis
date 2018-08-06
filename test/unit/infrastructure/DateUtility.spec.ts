import DateUtility, {
  DateParseError
} from "../../../src/infrastructure/DateUtility";
import * as moment from "moment";

describe("DateUtility", () => {
  it("should be able to create nowDate", () => {
    const momentObject = moment();

    const expected = {
      year: momentObject.format("YYYY"),
      month: momentObject.format("MM"),
      day: momentObject.format("DD")
    };

    expect(DateUtility.nowDate()).toEqual(expected);
  });

  it("should be able to create specifiedDate", () => {
    expect(DateUtility.specifiedDate("2018-01-01")).toEqual({
      year: "2018",
      month: "01",
      day: "01"
    });
    expect(DateUtility.specifiedDate("2018-12-31")).toEqual({
      year: "2018",
      month: "12",
      day: "31"
    });
  });

  it("should be a DateParseError", () => {
    try {
      const date = DateUtility.specifiedDate("2018-02-31");
      fail(date);
    } catch (error) {
      expect(error).toBeInstanceOf(DateParseError);
    }
  });

  it("should be able to get objects between the specified FormattedDate", () => {
    const fromDate = "2017-01-01";
    const toDate = "2017-01-05";

    const expected = [
      { year: "2017", month: "01", day: "01" },
      { year: "2017", month: "01", day: "02" },
      { year: "2017", month: "01", day: "03" },
      { year: "2017", month: "01", day: "04" },
      { year: "2017", month: "01", day: "05" }
    ];

    expect(DateUtility.betweenFormattedDate(fromDate, toDate)).toEqual(
      expected
    );
  });

  it("should work even if the fromDate and the toDate are the same", () => {
    const fromDate = "2018-01-01";
    const toDate = "2018-01-01";

    const expected = [{ year: "2018", month: "01", day: "01" }];

    expect(DateUtility.betweenFormattedDate(fromDate, toDate)).toEqual(
      expected
    );
  });

  it("should be a DateParseError. Because the fromDate is bigger than the toDate", () => {
    try {
      const fromDate = "2019-01-01";
      const toDate = "2018-01-01";

      const result = DateUtility.betweenFormattedDate(fromDate, toDate);
      fail(result);
    } catch (error) {
      expect(error).toBeInstanceOf(DateParseError);
    }
  });
});
