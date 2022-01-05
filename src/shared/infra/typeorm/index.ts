import {
  Connection,
  createConnection as createTypeORMConnection,
  getConnectionOptions,
} from "typeorm";

async function createConnection(host = "db"): Promise<Connection> {
  const defaultOptions = await getConnectionOptions();

  return createTypeORMConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === "test" ? "localhost" : host,
      database:
        process.env.NODE_ENV === "test"
          ? "rentx_test"
          : defaultOptions.database,
    })
  );
}

export { createConnection };
