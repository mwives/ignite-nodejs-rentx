import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: Connection;

describe("List categories controller", () => {
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

  it("should list all categories", async () => {
    const sessionsResponse = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { refreshToken } = sessionsResponse.body;

    await request(app)
      .post("/categories")
      .set({ Authorization: `Bearer ${refreshToken}` })
      .send({
        name: "Category name",
        description: "Category description",
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.categories.length).toBe(1);
    expect(response.body.categories[0]).toHaveProperty("id");
    expect(response.body.categories[0].name).toEqual("Category name");
  });
});
