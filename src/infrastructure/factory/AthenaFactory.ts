import { Athena } from "aws-sdk";

/**
 * AthenaFactory
 *
 * @author keitakn
 * @since 2018-08-15
 */
export default class AthenaFactory {
  /**
   * @return {Athena}
   */
  static create(): Athena {
    return new Athena({ apiVersion: "2017-05-18" });
  }
}
