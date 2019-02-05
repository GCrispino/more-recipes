import faker from "faker";
import jwt from "jsonwebtoken";
import middleware from "../../../middleware";
import config from "../../../config";
import { User } from "../../../database/models";

const { auth } = middleware;

describe("The auth middleware", () => {
  beforeEach(() => User.destroy({ where: {} }));

  test("Should call next if user is authenticated", async () => {
    const user = {
      name: "test",
      password: "12345678",
      email: faker.internet.email()
    };
    await User.destroy({ where: {} });
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
    await User.destroy({ where: {} });
  });

  test("Should call sendFailureResponse if user is not authenticated", async () => {
    const user = {
      name: "test",
      password: "12345678",
      email: "test@test.com"
    };
    await User.destroy({ where: {} });
    await User.create({ ...user, email: "test@test2.com" });

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

    await User.destroy({ where: {} });
  });

  test("Should throw an error if user is not found", async () => {
    const req = {
      body: {
        access_token: jwt.sign({ email: "not@found.com" }, config.JWT_SECRET)
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
