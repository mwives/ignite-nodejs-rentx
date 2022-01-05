import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: Connection;

describe("Create category controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuid();
    const hashedPassword = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(
        id,
        name,
        email,
        password,
        is_admin,
        created_at,
        driver_license
      ) VALUES(
        '${id}',
        'admin',
        'admin@rentx.com',
        '${hashedPassword}',
        true,
        'now()',
        'XXXXXX'
      )`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should create a new category", async () => {
    const sessionsResponse = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { refreshToken } = sessionsResponse.body;

    const response = await request(app)
      .post("/categories")
      .set({ Authorization: `Bearer ${refreshToken}` })
      .send({
        name: "Category name",
        description: "Category description",
      });

    expect(response.status).toBe(201);
  });

  it("should not create a new category if not authenticated", async () => {
    const response = await request(app).post("/categories").send({
      name: "Category name",
      description: "Category description",
    });

    expect(response.status).toBe(401);
  });

  it("should not create a new category with already existing name", async () => {
    const sessionsResponse = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { refreshToken } = sessionsResponse.body;

    await request(app)
      .post("/categories")
      .set({ Authorization: `Bearer ${refreshToken}` })
      .send({
        name: "Repeated category name",
        description: "Category description",
      });

    const response = await request(app)
      .post("/categories")
      .set({ Authorization: `Bearer ${refreshToken}` })
      .send({
        name: "Repeated category name",
        description: "Category description",
      });

    expect(response.status).toBe(400);
  });
});
