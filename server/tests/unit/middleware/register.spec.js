// @ts-check
import middleware from "../../../middleware";
import { User } from "../../../database/models";

const { registerUserValidator } = middleware;

test("The registerUserValidator calls the next function if the validation is successful", async () => {
  await User.destroy({ where: {} });

  const user = {
    name: "the name",
    password: "1234567",
    email: "valid@email.com"
  };
  const req = {
    body: user
  };
  const res = {
    sendFailureResponse: jest.fn()
  };
  const next = jest.fn();

  await registerUserValidator(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.sendFailureResponse).not.toHaveBeenCalled();
});

test("The registerUserValidator valls the sendFailureResponse function if the validation is not successful", async () => {
  await User.destroy({ where: {} });

  const user = {
    name: "test",
    password: "12345",
    email: "valid@email.com"
  };
  const req = {
    body: user
  };
  const res = {
    sendFailureResponse: jest.fn()
  };
  const next = jest.fn();

  await registerUserValidator(req, res, next);

  expect(res.sendFailureResponse).toHaveBeenCalledWith(
    {
      errors: [
        "The name must be longer than 5 characters.",
        "The password must be longer than 5 characters."
      ]
    },
    422
  );
  expect(next).not.toHaveBeenCalled();
});
