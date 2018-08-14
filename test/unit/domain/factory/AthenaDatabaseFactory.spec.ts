import AthenaDatabaseFactory from "../../../../src/domain/factory/AthenaDatabaseFactory";
import WebApiDatabase from "../../../../src/domain/athena/WebApiDatabase";
import DatabaseNotFoundError from "../../../../src/domain/error/DatabaseNotFoundError";

describe("AthenaDatabaseFactory", () => {
  it("should be able to create Databases", () => {
    const webApiDatabase = AthenaDatabaseFactory.create("qa", "web_api");

    expect(webApiDatabase).toBeInstanceOf(WebApiDatabase);
    expect(webApiDatabase.baseName).toBe("web_api");
  });

  it("should be a DatabaseNotFoundError", () => {
    try {
      const database = AthenaDatabaseFactory.create("qa", "not_found");
      fail(database);
    } catch (error) {
      expect(error).toBeInstanceOf(DatabaseNotFoundError);
    }
  });
});
