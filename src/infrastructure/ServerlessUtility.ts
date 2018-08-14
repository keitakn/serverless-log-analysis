import * as lambda from "aws-lambda";

/**
 * ServerlessUtility
 *
 * @author keitakn
 * @since 2018-08-15
 */
export default class ServerlessUtility {
  /**
   * @param event
   * @returns {boolean}
   */
  public static isWarmupRequest(event: any): boolean {
    if (!("source" in event)) {
      return false;
    }

    return event.source === "serverless-plugin-warmup";
  }

  /**
   * @returns {ProxyResult}
   */
  public static createWarmupResponse(): lambda.ProxyResult {
    return {
      statusCode: 200,
      body: ""
    };
  }
}
