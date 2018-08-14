/**
 * DataSources._dataSources
 */
interface IDataSources {
  [name: string]: {
    tables: string[];
  };
}

/**
 * Configuration class that defines available data sources
 * When adding databases and tables, we need to modify this class
 *
 * @author keitakn
 * @since 2018-08-14
 */
export default class DataSources {
  /**
   * Data source list
   */
  private readonly _dataSources: IDataSources;

  /**
   * Define the database
   */
  constructor() {
    this._dataSources = {
      web_api: {
        tables: ["app_logs"]
      }
    };
  }

  /**
   * @return {IDataSources}
   */
  get dataSources(): IDataSources {
    return this._dataSources;
  }

  /**
   * @param {string} databaseName
   * @return {boolean}
   */
  databaseExists(databaseName: string) {
    return databaseName in this.dataSources;
  }

  /**
   * @return {string[]}
   */
  extractDatabases(): string[] {
    return Object.keys(this.dataSources).map((databaseName: string) => {
      return databaseName;
    });
  }
}
