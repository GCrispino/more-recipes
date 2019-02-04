import middleware from "../../../middleware";
import { createResAndNextMocks } from "./utils";

const { signinUserValidator } = middleware;

describe("The signinUserValidator middleware", () => {
  test("Should call next when user signin object is valid", () => {
    const { res, next } = createResAndNextMocks();

    const req = {
      body: {
        email: "user@email.com",
        password: "123456"
      }
    };

    signinUserValidator(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.sendFailureResponse).not.toHaveBeenCalled();
  });

  test("Should call sendFailureResponse signin object is not valid", () => {
    const { res, next } = createResAndNextMocks();

    const req = {
      body: {
        email: "test"
      }
    };

    signinUserValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendFailureResponse).toHaveBeenCalledWith(
      {
        errors: [
          "The password is required.",
          "The email must be a valid email address."
        ]
      },
      422
    );
  });
});
