import supertest from "supertest";
import faker from "faker";
import app from "../../../index";

describe("The user signup test", () => {
  test("should register a new user", async () => {
    const response = await supertest(app)
      .post("/api/v1/users/signup")
      .send({
        name: "Test user",
        email: faker.internet.email(),
        password: "1234567"
      });

    console.log(response.body);
  });
});
