import * as lambda from "aws-lambda";
import * as sourceMapSupport from "source-map-support";
import WebApiDatabase from "../../domain/athena/WebApiDatabase";
import Environment from "../../infrastructure/Environment";
import { IAthenaDatabase } from "../../domain/athena/AthenaDatabase";
import { IAthenaTable } from "../../domain/athena/AthenaTable";
import AthenaService from "../service/AthenaService";
import ServerlessUtility from "../../infrastructure/ServerlessUtility";
import DateUtility from "../../infrastructure/DateUtility";
import AthenaFactory from "../../infrastructure/factory/AthenaFactory";

const athenaClient = AthenaFactory.create();

sourceMapSupport.install();

/**
 * @param {ScheduledEvent} event
 * @param {Context} context
 * @param {Callback} callback
 * @returns {Promise<void>}
 */
export const athenaAllTablePartitionAdd = async (
  event: lambda.ScheduledEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  if (ServerlessUtility.isWarmupRequest(event)) {
    return callback(undefined, ServerlessUtility.createWarmupResponse());
  }

  const targetDatabases = findTargetDatabases();

  const nowDate = DateUtility.nowDate();
  const athenaService = new AthenaService(athenaClient);

  await targetDatabases.map((database: IAthenaDatabase) => {
    return database.createHasTableList().map(async (table: IAthenaTable) => {
      return await athenaService.addPartition(table, nowDate);
    });
  });

  return callback();
};

/**
 * Find the target database
 * When adding databases and tables, we need to modify this function
 *
 * @return {IAthenaDatabase[]}
 */
const findTargetDatabases = (): IAthenaDatabase[] => {
  return [new WebApiDatabase(Environment.deployStage())];
};
