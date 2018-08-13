process.env.TZ = "Asia/Tokyo";

import * as lambda from "aws-lambda";
import * as sourceMapSupport from "source-map-support";
import { S3 } from "aws-sdk";
import S3Service from "../service/S3Service";

sourceMapSupport.install();

const s3Client = new S3({ apiVersion: "2006-03-01" });

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
  try {
    const s3Service = new S3Service(s3Client);
    await s3Service.convertToHiveFormat(event.Records);

    return callback();
  } catch (error) {
    return callback(error);
  }
};
