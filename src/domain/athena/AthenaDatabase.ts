import { IAthenaTable } from "./AthenaTable";

/**
 * AthenaDatabase
 *
 * @author keitakn
 * @since 2018-08-14
 */
export default abstract class AthenaDatabase {
  /**
   * stage
   */
  private readonly _stage: string;

  /**
   * Base database name
   * e.g. if stage is "dev" in "web_api", "dev_web_api"
   */
  private readonly _baseName: string;

  /**
   * Location name to save the results of SQL
   * default is "s3://aws-athena-query-results-{aws_account_id}-{region}/"
   * Using default makes it difficult to search, so define it for each database
   * Since we want to divide Bucket for each environment, we define it like "serverless-log-analysis-athena-query-results"
   */
  private readonly _outputLocationBaseName: string;

  /**
   * @param {string} stage
   * @param {string} baseName
   * @param {string} outputLocationBaseName
   */
  protected constructor(
    stage: string,
    baseName: string,
    outputLocationBaseName: string
  ) {
    this._stage = stage;
    this._baseName = baseName;
    this._outputLocationBaseName = outputLocationBaseName;
  }

  /**
   * @returns {string}
   */
  get stage(): string {
    return this._stage;
  }

  /**
   * @returns {string}
   */
  get baseName(): string {
    return this._baseName;
  }

  /**
   * @return {string}
   */
  get outputLocationBaseName(): string {
    return this._outputLocationBaseName;
  }

  /**
   * @returns {string}
   */
  createDatabaseSql() {
    return `CREATE DATABASE IF NOT EXISTS ${this.createDatabaseName()}`;
  }

  /**
   * @return {string}
   */
  createOutputLocationName(): string {
    return `s3://${this.outputLocationBaseName}-${this.stage}/`;
  }

  /**
   * @returns {string}
   */
  protected createDatabaseName(): string {
    return `${this.stage}_${this.baseName}`;
  }
}

/**
 * IAthenaDatabase
 *
 * @author keitakn
 * @since 2018-08-14
 */
export interface IAthenaDatabase extends AthenaDatabase {
  /**
   * @returns {IAthenaTable[]}
   */
  createHasTableList(): IAthenaTable[];

  /**
   * @param {string} tableName
   * @return {IAthenaTable}
   */
  createTableByName(tableName: string): IAthenaTable;
}
