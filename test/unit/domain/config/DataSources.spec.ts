import DataSources from "../../../../src/domain/config/DataSources";

describe("DataSources", () => {
  it("should be able to extractDatabases", () => {
    const dataSources = new DataSources();
    const databases = ["web_api"];

    expect(dataSources.extractDatabases()).toEqual(databases);
  });
});
