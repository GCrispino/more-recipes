import supertest from "supertest";
import faker from "faker";
import app from "../../../index";
import { User } from "../../../database/models";

describe("The user signup test", () => {
  test("should register a new user", async () => {
    const fakeUser = {
      name: "Test user",
      email: faker.internet.email(),
      password: "1234567"
    };
    const response = await supertest(app)
      .post("/api/v1/users/signup")
      .send(fakeUser)
      .expect(200);

    expect(response.body.data.user.email).toBe(fakeUser.email);
    expect(response.body.data.user.name).toBe(fakeUser.name);
    expect(response.body.data.access_token).toBeDefined();

    const userfromDB = User.find({ where: { email: fakeUser.email } });

    expect(userfromDB).toBeTruthy();
  });
});
