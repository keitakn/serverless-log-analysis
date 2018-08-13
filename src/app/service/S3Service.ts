import { S3 } from "aws-sdk";
import { S3EventRecord } from "aws-lambda";
import DateUtility from "../../infrastructure/DateUtility";
import * as path from "path";
import { AWSError } from "aws-sdk/lib/error";

/**
 * S3Service
 *
 * @author keitakn
 * @since 2018-08-13
 */
export default class S3Service {
  /**
   * S3 Client
   */
  private readonly _s3Client: S3;

  /**
   * @param {S3} s3Client
   */
  constructor(s3Client: S3) {
    this._s3Client = s3Client;
  }

  /**
   * @return {S3}
   */
  get s3Client(): S3 {
    return this._s3Client;
  }

  /**
   * @param {S3EventRecord[]} eventRecords
   * @return {Promise<Promise<Promise<void> | S3.CopyObjectOutput>[]>}
   */
  async convertToHiveFormat(eventRecords: S3EventRecord[]) {
    return eventRecords.map(async (eventRecord: S3EventRecord) => {
      const copySource = S3Service.extractCopySourceFromS3(eventRecord);

      if (S3Service.isDir(copySource)) {
        console.log(`Skip, because ${copySource} is directory.`);
        return Promise.resolve();
      }

      const toBucket = eventRecord.s3.bucket.name;
      const destKey = S3Service.createDestKey(eventRecord);

      const params = {
        CopySource: copySource,
        Bucket: toBucket,
        Key: destKey
      };

      return await this.s3Client
        .copyObject(params)
        .promise()
        .then(async (data: S3.Types.CopyObjectOutput) => {
          console.log(`s3://${copySource} copy to s3://${toBucket}/${destKey}`);
          return Promise.resolve(data);
        })
        .catch(async (error: AWSError) => {
          console.error(error);
          return Promise.reject(error);
        });
    });
  }

  /**
   * e.g. "dt=2018-06-26/hour=07"
   *
   * @return {string}
   */
  private static createTodayPartition() {
    const moment = DateUtility.nowDateInMomentObject();

    const year = moment.format("YYYY");
    const month = moment.format("MM");
    const day = moment.format("DD");
    const hour = moment.format("HH");

    return `dt=${year}-${month}-${day}/hour=${hour}`;
  }

  /**
   * @param {S3EventRecord} eventRecord
   * @return {string}
   */
  private static formatS3ObjectKey(eventRecord: S3EventRecord): string {
    return decodeURIComponent(eventRecord.s3.object.key.replace(/\+/g, " "));
  }

  /**
   * @param {S3EventRecord} eventRecord
   * @return {string}
   */
  private static extractCopySourceFromS3(eventRecord: S3EventRecord) {
    const bucketName = eventRecord.s3.bucket.name;
    const objectKey = S3Service.formatS3ObjectKey(eventRecord);

    return `${bucketName}/${objectKey}`;
  }

  /**
   * @param {string} copySource
   * @return {boolean}
   */
  private static isDir(copySource: string) {
    return copySource.endsWith("/");
  }

  /**
   * @param {S3EventRecord} eventRecord
   * @return {string}
   */
  private static createDestKey(eventRecord: S3EventRecord) {
    const objectKey = S3Service.formatS3ObjectKey(eventRecord);
    const fileName = path.basename(objectKey);
    const todayPartition = S3Service.createTodayPartition();

    return `hive/${todayPartition}/${fileName}`;
  }
}
