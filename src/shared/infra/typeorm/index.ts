import {
  Connection,
  createConnection as createTypeORMConnection,
  getConnectionOptions,
} from "typeorm";

async function createConnection(): Promise<Connection> {
  const defaultOptions = await getConnectionOptions();

  return createTypeORMConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "rentx_test"
          : defaultOptions.database,
    })
  );
}

export { createConnection };
