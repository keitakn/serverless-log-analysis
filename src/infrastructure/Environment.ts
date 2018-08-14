/**
 * Environment
 *
 * @author keitakn
 * @since 2018-08-15
 */
export default class Environment {
  /**
   * @returns {boolean}
   */
  public static deployStage(): string {
    if (typeof process.env.DEPLOY_STAGE === "string") {
      return process.env.DEPLOY_STAGE;
    }

    return "qa";
  }
}
