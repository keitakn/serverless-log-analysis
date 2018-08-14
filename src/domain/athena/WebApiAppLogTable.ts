import { IAthenaTable } from "./AthenaTable";

/**
 * WebApiAppLogTable
 *
 * @author keitakn
 * @since 2018-08-14
 */
export default class WebApiAppLogTable implements IAthenaTable {
  private readonly _database: string;
  private readonly _table: string;
  private readonly _partitionLocation: string;
  private readonly _outputLocation: string;

  /**
   * @param {string} database
   * @param {string} table
   * @param {string} partitionLocation
   * @param {string} outputLocation
   */
  constructor(
    database: string,
    table: string,
    partitionLocation: string,
    outputLocation: string
  ) {
    this._database = database;
    this._table = table;
    this._partitionLocation = partitionLocation;
    this._outputLocation = outputLocation;
  }

  /**
   * @returns {string}
   */
  get database(): string {
    return this._database;
  }

  /**
   * @returns {string}
   */
  get table(): string {
    return this._table;
  }

  /**
   * @returns {string}
   */
  get partitionLocation(): string {
    return this._partitionLocation;
  }

  /**
   * @return {string}
   */
  get outputLocation(): string {
    return this._outputLocation;
  }

  /**
   * @returns {string}
   */
  createTableSql(): string {
    return `
      CREATE EXTERNAL TABLE IF NOT EXISTS ${this.database}.${this.table} (
        log_level STRING,
        message STRING,
        channel STRING,
        trace_id STRING,
        file STRING,
        line INT,
        context STRUCT <
          request: STRUCT < header: MAP<STRING, STRING>, params: STRUCT<sub:INT> >,
          response: MAP <STRING, STRING>
        >,
        remote_ip_address STRING,
        server_ip_address STRING,
        user_agent STRING,
        datetime STRING,
        timezone STRING,
        process_time DOUBLE,
        errors STRUCT < message:STRING, code:INT, file:STRING, line:INT, trace:ARRAY<STRING>>
      )
      PARTITIONED BY (dt STRING, hour STRING)
      ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
      LOCATION '${this.partitionLocation}'
    `;
  }

  /**
   * @return {string}
   */
  createAddPartitionSql(): string {
    return `MSCK REPAIR TABLE ${this.database}.${this.table}`;
  }
}
