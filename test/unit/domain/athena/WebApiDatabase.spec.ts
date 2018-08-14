import WebApiDatabase from "../../../../src/domain/athena/WebApiDatabase";
import WebApiAppLogTable from "../../../../src/domain/athena/WebApiAppLogTable";
import TableNotFoundError from "../../../../src/domain/error/TableNotFoundError";

describe("WebApiDatabase", () => {
  it("should be able to create WebApiDatabase", () => {
    const database = new WebApiDatabase("dev");

    const expectedCreateDatabaseSql =
      "CREATE DATABASE IF NOT EXISTS dev_web_api";

    expect(database.createDatabaseSql()).toBe(expectedCreateDatabaseSql);

    const expectedTables = [
      new WebApiAppLogTable(
        "dev_web_api",
        "app_logs",
        "s3://serverless-log-analysis-logs-dev/hive/",
        "s3://serverless-log-analysis-athena-query-results-dev/"
      )
    ];

    expect(database.createHasTableList()).toEqual(expectedTables);
  });

  it("should be able to create any table", () => {
    const database = new WebApiDatabase("dev");

    const expectedAppLogTable = new WebApiAppLogTable(
      "dev_web_api",
      "app_logs",
      "s3://serverless-log-analysis-logs-dev/hive/",
      "s3://serverless-log-analysis-athena-query-results-dev/"
    );

    expect(database.createTableByName("app_logs")).toEqual(expectedAppLogTable);
  });

  it("should be a TableNotFoundError", () => {
    try {
      const database = new WebApiDatabase("dev");
      const table = database.createTableByName("no_table");
      fail(table);
    } catch (error) {
      expect(error).toBeInstanceOf(TableNotFoundError);
    }
  });
});
