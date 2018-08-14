import { IAthenaDatabase } from "../athena/AthenaDatabase";
import DataSources from "../config/DataSources";
import DatabaseNotFoundError from "../error/DatabaseNotFoundError";
import WebApiDatabase from "../athena/WebApiDatabase";

/**
 * Create the specified database object
 *
 * @author keitakn
 * @since 2018-08-14
 */
export default class AthenaDatabaseFactory {
  /**
   * @param {string} stage
   * @param {string} databaseName
   * @return {AthenaDatabase}
   */
  static create(stage: string, databaseName: string): IAthenaDatabase {
    const dataSources = new DataSources();
    if (!dataSources.databaseExists(databaseName)) {
      throw new DatabaseNotFoundError();
    }

    return AthenaDatabaseFactory.createDatabase(stage, databaseName);
  }

  /**
   * @param {string} stage
   * @param {string} databaseName
   * @return {IAthenaDatabase}
   */
  private static createDatabase(
    stage: string,
    databaseName: string
  ): IAthenaDatabase {
    switch (databaseName) {
      case "web_api":
        return new WebApiDatabase(stage);
      default:
        return new WebApiDatabase(stage);
    }
  }
}
