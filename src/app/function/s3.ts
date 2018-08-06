process.env.TZ = "Asia/Tokyo";

import * as lambda from "aws-lambda";
import * as sourceMapSupport from "source-map-support";

sourceMapSupport.install();

/**
 * @param {S3CreateEvent} event
 * @param {Context} context
 * @param {Callback} callback
 * @return {Promise<void>}
 */
export const convertToHiveFormat = async (
  event: lambda.S3CreateEvent,
  context: lambda.Context,
  callback: lambda.Callback
) => {
  return callback();
};
