import { hash } from "bcrypt";
import { v4 as uuid } from "uuid";

import { createConnection } from "..";

async function createAdminUser() {
  try {
    const connection = await createConnection();

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

    await connection.close();
  } catch (err) {
    console.log(err);
  }
}

createAdminUser().then(() => console.log("Admin user created."));
