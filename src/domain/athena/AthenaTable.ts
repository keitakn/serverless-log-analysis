import { IFormattedDate } from "../../infrastructure/DateUtility";

/**
 * IAthenaTable
 *
 * @author keitakn
 * @since 2018-08-14
 */
export interface IAthenaTable {
  database: string;
  table: string;
  partitionLocation: string;
  outputLocation: string;

  /**
   * @returns {string}
   */
  createTableSql(): string;

  /**
   * @param {IFormattedDate} formattedDate
   * @return {string}
   */
  createAddPartitionSql(formattedDate: IFormattedDate): string;
}
