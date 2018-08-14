import AthenaDatabase, { IAthenaDatabase } from "./AthenaDatabase";
import { IAthenaTable } from "./AthenaTable";
import WebApiAppLogTable from "./WebApiAppLogTable";
import TableNotFoundError from "../error/TableNotFoundError";

/**
 * WebApiDatabase
 *
 * @author keitakn
 * @since 2018-08-14
 */
export default class WebApiDatabase extends AthenaDatabase
  implements IAthenaDatabase {
  /**
   * Base database name
   *
   * @type {string}
   */
  static readonly BASE_NAME: string = "web_api";

  /**
   * Name of the table for saving logs
   *
   * @type {string}
   */
  static readonly LOGS_TABLE_NAME: string = "app_logs";

  /**
   * Location base name for storing SQL results
   *
   * @type {string}
   */
  static readonly OUTPUT_LOCATION_BASE_NAME: string =
    "serverless-log-analysis-athena-query-results";

  /**
   * @param {string} stage
   */
  constructor(stage: string) {
    super(
      stage,
      WebApiDatabase.BASE_NAME,
      WebApiDatabase.OUTPUT_LOCATION_BASE_NAME
    );
  }

  /**
   * @returns {IAthenaTable[]}
   */
  createHasTableList(): IAthenaTable[] {
    return [
      new WebApiAppLogTable(
        this.createDatabaseName(),
        WebApiDatabase.LOGS_TABLE_NAME,
        this.createPartitionLocation(),
        this.createOutputLocationName()
      )
    ];
  }

  /**
   * @param {string} tableName
   * @return {IAthenaTable}
   */
  createTableByName(tableName: string): IAthenaTable {
    switch (tableName) {
      case WebApiDatabase.LOGS_TABLE_NAME:
        const table = new WebApiAppLogTable(
          this.createDatabaseName(),
          WebApiDatabase.LOGS_TABLE_NAME,
          this.createPartitionLocation(),
          this.createOutputLocationName()
        );

        return table;
      default:
        throw new TableNotFoundError();
    }
  }

  /**
   * @return {string}
   */
  private createPartitionLocation(): string {
    return `s3://serverless-log-analysis-logs-${this.stage}/hive/`;
  }
}
