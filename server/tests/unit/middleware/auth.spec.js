import faker from "faker";
import jwt from "jsonwebtoken";
import middleware from "../../../middleware";
import config from "../../../config";
import { User } from "../../../database/models";

const { auth } = middleware;

describe("The auth middleware", () => {
  test("Should call next if user is authenticated", async () => {
    const user = {
      name: "test",
      password: "12345678",
      email: faker.internet.email()
    };
    await User.create(user);

    const token = jwt.sign(user, config.JWT_SECRET);
    const req = {
      body: { access_token: token }
    };

    const next = jest.fn();
    const res = {
      sendFailureResponse: jest.fn()
    };

    await auth(req, res, next);
    const userRecord = await User.findOne({
      where: { email: user.email }
    });

    expect(next).toHaveBeenCalled();
    expect(res.sendFailureResponse).not.toHaveBeenCalled();
    expect(req).toHaveProperty("authUser", userRecord.get());
    expect(req).toHaveProperty("authUserObj", userRecord);
  });

  test("Should call sendFailureResponse if user is not authenticated", async () => {
    const user = {
      name: "test",
      password: "12345678",
      email: faker.internet.email()
    };
    await User.create({ ...user, email: faker.internet.email() });

    const req = {
      body: {},
      query: {},
      headers: {}
    };

    const next = jest.fn();
    const res = {
      sendFailureResponse: jest.fn()
    };

    await auth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendFailureResponse).toHaveBeenCalledWith(
      { message: "Unauthenticated." },
      401
    );
  });

  test("Should throw an error if user is not found", async () => {
    const req = {
      body: {
        access_token: jwt.sign(
          { email: faker.internet.email() },
          config.JWT_SECRET
        )
      }
    };

    const next = jest.fn();
    const res = {
      sendFailureResponse: jest.fn()
    };

    await auth(req, res, next);

    expect(res.sendFailureResponse).toHaveBeenCalledWith(
      { message: "Unauthenticated." },
      401
    );
  });
});
