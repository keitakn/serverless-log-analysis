import { Athena, AWSError } from "aws-sdk";
import { IAthenaTable } from "../../domain/athena/AthenaTable";
import AthenaDatabase from "../../domain/athena/AthenaDatabase";
import { IFormattedDate } from "../../infrastructure/DateUtility";
import DataSources from "../../domain/config/DataSources";
import AthenaDatabaseFactory from "../../domain/factory/AthenaDatabaseFactory";

/**
 * AthenaService
 *
 * @author keitakn
 * @since 2018-08-15
 */
export default class AthenaService {
  /**
   * AWS-SDK Athena Client
   */
  private readonly _athenaClient: Athena;

  /**
   * @param {Athena} athenaClient
   */
  constructor(athenaClient: Athena) {
    this._athenaClient = athenaClient;
  }

  /**
   * @returns {Athena}
   */
  get athenaClient(): Athena {
    return this._athenaClient;
  }

  /**
   * @param {AthenaDatabase} athenaDatabase
   * @returns {Promise<any>}
   */
  public createDatabase(athenaDatabase: AthenaDatabase) {
    return new Promise((resolve, reject) => {
      const queryString = athenaDatabase.createDatabaseSql();

      const params = {
        QueryString: queryString,
        ResultConfiguration: {
          OutputLocation: athenaDatabase.createOutputLocationName()
        }
      };

      this.athenaClient.startQueryExecution(
        params,
        async (err: AWSError, data: Athena.Types.StartQueryExecutionOutput) => {
          if (err != null) {
            console.error(err);
            reject(err);
          }

          resolve(data);
        }
      );
    });
  }

  /**
   * @param {string} stage
   * @param {DataSources} dataSources
   * @return {Promise<any>[]}
   */
  public async createAllDatabase(stage: string, dataSources: DataSources) {
    return dataSources.extractDatabases().map(async (databasesName: string) => {
      const database = AthenaDatabaseFactory.create(stage, databasesName);
      return await this.createDatabase(database);
    });
  }

  /**
   * @param {IAthenaTable} athenaTable
   * @returns {Promise<any>}
   */
  public createTable(athenaTable: IAthenaTable) {
    return new Promise((resolve, reject) => {
      const queryString = athenaTable.createTableSql();

      const params = {
        QueryString: queryString,
        ResultConfiguration: {
          OutputLocation: athenaTable.outputLocation
        }
      };

      this.athenaClient.startQueryExecution(
        params,
        async (err: AWSError, data: Athena.Types.StartQueryExecutionOutput) => {
          if (err != null) {
            console.error(err);
            reject(err);
          }

          resolve(data);
        }
      );
    });
  }

  /**
   * @param {string} stage
   * @param {DataSources} dataSources
   * @return {Promise<Promise<Promise<any>[]>[]>}
   */
  public async createAllTable(stage: string, dataSources: DataSources) {
    return dataSources.extractDatabases().map(async (databasesName: string) => {
      const database = AthenaDatabaseFactory.create(stage, databasesName);
      await this.createDatabase(database);

      return database
        .createHasTableList()
        .map(async (athenaTable: IAthenaTable) => {
          return await this.createTable(athenaTable);
        });
    });
  }

  /**
   * @param {IAthenaTable} athenaTable
   * @param {IFormattedDate} formattedDate
   * @return {Promise<any>}
   */
  public addPartition(
    athenaTable: IAthenaTable,
    formattedDate: IFormattedDate
  ) {
    return new Promise((resolve, reject) => {
      const queryString = athenaTable.createAddPartitionSql(formattedDate);

      const params = {
        QueryString: queryString,
        ResultConfiguration: {
          OutputLocation: athenaTable.outputLocation
        }
      };

      this.athenaClient.startQueryExecution(
        params,
        async (err: AWSError, data: Athena.Types.StartQueryExecutionOutput) => {
          if (err != null) {
            console.error(err);
            reject(err);
          }

          resolve(data);
        }
      );
    });
  }
}
