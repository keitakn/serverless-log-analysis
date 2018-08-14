import WebApiAppLogTable from "../../../../src/domain/athena/WebApiAppLogTable";

describe("WebApiAppLogTable", () => {
  let WebApiTable: WebApiAppLogTable;

  beforeEach(() => {
    WebApiTable = new WebApiAppLogTable(
      "qa_web_api",
      "app_logs",
      "s3://serverless-log-analysis-logs-qa/hive/",
      "s3://serverless-log-analysis-athena-query-results-qa/"
    );
  });

  it("should be able to create createTableSql", () => {
    const expectedCreateTableSql = `
      CREATE EXTERNAL TABLE IF NOT EXISTS qa_web_api.app_logs (
        log_level STRING,
        message STRING,
        channel STRING,
        trace_id STRING,
        file STRING,
        line INT,
        context STRUCT <
          request: STRUCT < header: MAP<STRING, STRING>, params: STRUCT<sub:INT> >,
          response: MAP <STRING, STRING>
        >,
        remote_ip_address STRING,
        server_ip_address STRING,
        user_agent STRING,
        datetime STRING,
        timezone STRING,
        process_time DOUBLE,
        errors STRUCT < message:STRING, code:INT, file:STRING, line:INT, trace:ARRAY<STRING>>
      )
      PARTITIONED BY (dt STRING, hour STRING)
      ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
      LOCATION 's3://serverless-log-analysis-logs-qa/hive/'
    `;

    expect(WebApiTable.createTableSql()).toBe(expectedCreateTableSql);
  });

  it("should be able to create AddPartitionSql", () => {
    const expectedAddPartitionSql = "MSCK REPAIR TABLE qa_web_api.app_logs";

    expect(WebApiTable.createAddPartitionSql()).toBe(expectedAddPartitionSql);
  });

  it("should be able to get outputLocation", () => {
    const expectedOutputLocation =
      "s3://serverless-log-analysis-athena-query-results-qa/";

    expect(WebApiTable.outputLocation).toBe(expectedOutputLocation);
  });
});
