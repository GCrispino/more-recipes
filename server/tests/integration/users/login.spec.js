import supertest from "supertest";
import faker from "faker";
import bcrypt from "bcrypt";
import app from "../../../index";
import { User } from "../../../database/models";

describe("The user login", () => {
  test("The user can login and get a jwt", async () => {
    const password = "1234567";
    const fakeUser = {
      name: "testuser",
      email: faker.internet.email(),
      password: await bcrypt.hash(password, 1)
    };

    await User.create(fakeUser);

    const response = await supertest(app)
      .post("/api/v1/users/signin")
      .send({ ...fakeUser, password })
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe(fakeUser.email);
    expect(response.body.data.access_token).toBeTruthy();
  });

  test("Should return validation error if email is not provided", async () => {
    const fakeUser = {
      name: "testuser",
      password: "1234567"
    };

    const response = await supertest(app)
      .post("/api/v1/users/signin")
      .send(fakeUser)
      .expect(422);

    expect(response.body.status).toBe("fail");
    expect(response.body.data).toEqual({ errors: ["The email is required."] });
  });

  test("Should return validation error if email is not valid", async () => {
    const fakeUser = {
      name: "testuser",
      email: "bad@email",
      password: "1234567"
    };

    const response = await supertest(app)
      .post("/api/v1/users/signin")
      .send(fakeUser)
      .expect(422);

    expect(response.body.status).toBe("fail");
    expect(response.body.data).toEqual({
      errors: ["The email must be a valid email address."]
    });
  });

  test("Should return validation error if password is not provided", async () => {
    const fakeUser = {
      name: "testuser",
      email: faker.internet.email()
    };

    const response = await supertest(app)
      .post("/api/v1/users/signin")
      .send(fakeUser)
      .expect(422);

    expect(response.body.status).toBe("fail");
    expect(response.body.data).toEqual({
      errors: ["The password is required."]
    });
  });

  test("Should return validation errors if password and email are not provided", async () => {
    const fakeUser = {};

    const response = await supertest(app)
      .post("/api/v1/users/signin")
      .send(fakeUser)
      .expect(422);

    expect(response.body.status).toBe("fail");
    expect(response.body.data).toEqual({
      errors: ["The password is required.", "The email is required."]
    });
  });
});
