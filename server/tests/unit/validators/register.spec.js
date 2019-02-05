import faker from "faker";
import { testValidatorFactory, testValidatorFactoryAsync } from "./utils";
import validators from "../../../validators";
import { User } from "../../../database/models";

const { RegisterUserValidator } = validators;

const testRegisterUserValidator = testValidatorFactory(RegisterUserValidator);
const testRegisterUserValidatorAsync = testValidatorFactoryAsync(
  RegisterUserValidator
);

describe("The RegisterUserValidator class", () => {
  beforeEach(() => User.destroy({ where: {} }));
  describe("The validateName function", () => {
    test("The validateName function adds a required error to the errors array if name is not provided", () => {
      const [_, __, errors] = testRegisterUserValidator({}, "validateName");

      expect(errors).toEqual(["The name is required."]);
    });

    test("Adds an error if name is less than 5 characters", () => {
      const [_, __, errors] = testRegisterUserValidator(
        {
          name: "test"
        },
        "validateName"
      );

      expect(errors).toEqual(["The name must be longer than 5 characters."]);
    });
  });

  describe("The validatePassword function", () => {
    test("The validatePassword function adds a required error to the errors array if password is not provided", () => {
      const [_, __, errors] = testRegisterUserValidator({}, "validatePassword");

      expect(errors).toEqual(["The password is required."]);
    });

    test("Adds an error if password is less than 5 characters", () => {
      const [_, __, errors] = testRegisterUserValidator(
        {
          password: "test"
        },
        "validatePassword"
      );

      expect(errors).toEqual([
        "The password must be longer than 5 characters."
      ]);
    });
  });

  describe("The validateEmail function", () => {
    test("Adds a required error to the errors array if email is not provided", async () => {
      const [_, __, errors] = await testRegisterUserValidatorAsync(
        {
          name: "test"
        },
        "validateEmail"
      );

      expect(errors).toEqual(["The email is required."]);
    });

    test("Adds an error if email is invalid", async () => {
      const [_, __, errors] = await testRegisterUserValidatorAsync(
        {
          name: "test",
          email: "testing"
        },
        "validateEmail"
      );

      expect(errors).toEqual(["The email must be a valid email address."]);
    });

    test("Adds an email taken error if user already exists with that email", async () => {
      const user = await User.create({
        name: "bahdcoder",
        email: faker.internet.email(),
        password: "password"
      });

      const [_, __, errors] = await testRegisterUserValidatorAsync(
        {
          email: user.email
        },
        "validateEmail"
      );

      expect(errors).toEqual(["A user with this email already exists."]);
    });
  });

  describe("The isValid function", () => {
    test("Returns true if validation passes", async () => {
      const [_, result] = await testRegisterUserValidatorAsync(
        {
          name: "bahdcoder",
          email: faker.internet.email(),
          password: "password"
        },
        "isValid"
      );

      expect(result).toBe(true);
    });

    test("Returns false if validation passes", async () => {
      const [_, result] = await testRegisterUserValidatorAsync(
        {
          name: "bahd",
          email: faker.internet.email(),
          password: "password"
        },
        "isValid"
      );

      expect(result).toBe(false);
    });

    test("The validateName, validateEmail and validatePassword functions are called in the isValid function", async () => {
      const beforeAction = validator => {
        jest.spyOn(validator, "validateName");
        jest.spyOn(validator, "validateEmail");
        jest.spyOn(validator, "validatePassword");
      };

      const [validator] = await testRegisterUserValidatorAsync(
        {
          name: "test",
          password: "pass",
          email: "bahdcoder@gmail"
        },
        "isValid",
        beforeAction
      );

      expect(validator.validateName).toHaveBeenCalled();
      expect(validator.validateEmail).toHaveBeenCalled();
      expect(validator.validatePassword).toHaveBeenCalled();
    });
  });
});
