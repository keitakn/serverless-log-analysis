import * as lambda from "aws-lambda";
import * as sourceMapSupport from "source-map-support";
import Environment from "../../infrastructure/Environment";
import AthenaService from "../service/AthenaService";
import ServerlessUtility from "../../infrastructure/ServerlessUtility";
import DateUtility, { IFormattedDate } from "../../infrastructure/DateUtility";
import AthenaFactory from "../../infrastructure/factory/AthenaFactory";
import AthenaDatabaseFactory from "../../domain/factory/AthenaDatabaseFactory";
import DataSources from "../../domain/config/DataSources";

const athenaClient = AthenaFactory.create();

sourceMapSupport.install();

/**
 * createDatabase.event
 */
interface ICreateDatabaseEvent {
  databaseName: string;
}

/**
 * createTable.event
 */
interface ICreateTableEvent extends ICreateDatabaseEvent {
  tableName: string;
}

/**
 * addPartition.event
 */
interface IAddPartitionEvent extends ICreateTableEvent {
  toDate: string;
  fromDate: string;
}

/**
 * @param event
 * @param {Context} context
 * @param {Callback} callback
 * @returns {Promise<void>}
 */
export const createDatabase = async (
  event: ICreateDatabaseEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    if (ServerlessUtility.isWarmupRequest(event)) {
      return callback(undefined, ServerlessUtility.createWarmupResponse());
    }

    const databaseName = event.databaseName;
    if (databaseName == null) {
      return callback(new Error("Database name is not set"));
    }

    const database = AthenaDatabaseFactory.create(
      Environment.deployStage(),
      databaseName
    );

    const athenaService = new AthenaService(athenaClient);
    const result = await athenaService.createDatabase(database);

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };

    return callback(undefined, response);
  } catch (error) {
    return callback(error);
  }
};

/**
 * @param event
 * @param {Context} context
 * @param {Callback} callback
 * @return {Promise<void>}
 */
export const createAllDatabase = async (
  event: any,
  context: lambda.Context,
  callback: lambda.Callback
) => {
  try {
    if (ServerlessUtility.isWarmupRequest(event)) {
      return callback(undefined, ServerlessUtility.createWarmupResponse());
    }

    const dataSources = new DataSources();

    const athenaService = new AthenaService(athenaClient);
    const result = await athenaService.createAllDatabase(
      Environment.deployStage(),
      dataSources
    );

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };

    return callback(undefined, response);
  } catch (error) {
    return callback(error);
  }
};

/**
 * @param event
 * @param {Context} context
 * @param {Callback} callback
 * @returns {Promise<void>}
 */
export const createTable = async (
  event: ICreateTableEvent,
  context: lambda.Context,
  callback: lambda.Callback
) => {
  try {
    if (ServerlessUtility.isWarmupRequest(event)) {
      return callback(undefined, ServerlessUtility.createWarmupResponse());
    }

    const databaseName = event.databaseName;
    if (databaseName == null) {
      return callback(new Error("Database name is not set"));
    }

    const tableName = event.tableName;
    if (tableName == null) {
      return callback(new Error("TableName name is not set"));
    }

    const database = AthenaDatabaseFactory.create(
      Environment.deployStage(),
      databaseName
    );

    const table = database.createTableByName(tableName);

    const athenaService = new AthenaService(athenaClient);
    const result = await athenaService.createTable(table);

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };

    return callback(undefined, response);
  } catch (error) {
    return callback(error);
  }
};

/**
 * @param {ICreateTableEvent} event
 * @param {Context} context
 * @param {Callback} callback
 * @return {Promise<void>}
 */
export const createAllTable = async (
  event: ICreateTableEvent,
  context: lambda.Context,
  callback: lambda.Callback
) => {
  try {
    if (ServerlessUtility.isWarmupRequest(event)) {
      return callback(undefined, ServerlessUtility.createWarmupResponse());
    }

    const dataSources = new DataSources();

    const athenaService = new AthenaService(athenaClient);
    const result = await athenaService.createAllTable(
      Environment.deployStage(),
      dataSources
    );

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };

    return callback(undefined, response);
  } catch (error) {
    return callback(error);
  }
};

/**
 * @param {IAddPartitionEvent} event
 * @param {Context} context
 * @param {Callback} callback
 * @return {Promise<void>}
 */
export const addPartition = async (
  event: IAddPartitionEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    if (ServerlessUtility.isWarmupRequest(event)) {
      return callback(undefined, ServerlessUtility.createWarmupResponse());
    }

    const databaseName = event.databaseName;
    if (databaseName == null) {
      return callback(new Error("Database name is not set"));
    }

    const tableName = event.tableName;
    if (tableName == null) {
      return callback(new Error("TableName name is not set"));
    }

    const database = AthenaDatabaseFactory.create(
      Environment.deployStage(),
      databaseName
    );

    const table = database.createTableByName(tableName);

    const athenaService = new AthenaService(athenaClient);

    const formattedDateList = DateUtility.betweenFormattedDate(
      event.fromDate,
      event.toDate
    );

    const result = formattedDateList.map(
      async (formattedDate: IFormattedDate) => {
        return await athenaService.addPartition(table, formattedDate);
      }
    );

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };

    return callback(undefined, response);
  } catch (error) {
    return callback(error);
  }
};
