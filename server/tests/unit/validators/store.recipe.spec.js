import { testValidatorFactory } from "./utils";
import validators from "../../../validators";

const { StoreRecipeValidator } = validators;

const testStoreRecipeValidator = testValidatorFactory(StoreRecipeValidator);

describe("The StoreRecipeValidator class", () => {
  describe("The isValid function", () => {
    test("Should return false when no recipe is provided", () => {
      const [_, result, errors] = testStoreRecipeValidator(
        undefined,
        "isValid"
      );

      expect(result).toBe(false);
      expect(errors).toEqual(["No recipe was provided."]);
    });

    test("Should return true when valid recipe is passed", () => {
      const beforeAction = validator => {
        jest.spyOn(validator, "validateTitle");
        jest.spyOn(validator, "validateDescription");
        jest.spyOn(validator, "validateTimeToCook");
        jest.spyOn(validator, "validateImageUrl");
        jest.spyOn(validator, "validateIngredients");
        jest.spyOn(validator, "validateProcedure");
      };

      const [validator, result, errors] = testStoreRecipeValidator(
        {
          title: "Recipe title",
          description: "This is so descriptive yea",
          timeToCook: "1000",
          ingredients: '["meat","rice"]',
          imageUrl: "https://www.images.com/deliciousStuff.jpg",
          procedure: '["first this","then that"]'
        },
        "isValid",
        beforeAction
      );

      expect(validator.validateTitle).toHaveBeenCalled();
      expect(validator.validateDescription).toHaveBeenCalled();
      expect(validator.validateTimeToCook).toHaveBeenCalled();
      expect(validator.validateImageUrl).toHaveBeenCalled();
      expect(validator.validateIngredients).toHaveBeenCalled();
      expect(validator.validateProcedure).toHaveBeenCalled();
      expect(result).toBe(true);
      expect(errors).toEqual([]);
    });
  });

  describe("The validateTitle function", () => {
    test("Should return required error if title is not passed", () => {
      const [_, __, errors] = testStoreRecipeValidator({}, "validateTitle");

      expect(errors).toEqual(["The title is required."]);
    });

    test("Should return error if title length is not more than 5 characters", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          title: "test"
        },
        "validateTitle"
      );

      expect(errors).toEqual(["The title must be longer than 5 characters."]);
    });

    test("Should be successful if title is passed and is longer than 5 chars", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          title: "test title"
        },
        "validateTitle"
      );

      expect(errors).toEqual([]);
    });
  });

  describe("The validateDescription function", () => {
    test("Should return error if description is undefined", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          description: undefined
        },
        "validateDescription"
      );

      expect(errors).toEqual(["The description is required."]);
    });

    test("Should return error if description is less than 5 characters long", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          description: "test"
        },
        "validateDescription"
      );

      expect(errors).toEqual([
        "The description must be longer than 5 characters."
      ]);
    });

    test("Should be succcessful if description is longer than 5 characters", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          description: "description"
        },
        "validateDescription"
      );

      expect(errors).toEqual([]);
    });
  });

  describe("The validateTimeToCook function", () => {
    test("Should return required error if timeToCook is undefined", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          timeToCook: undefined
        },
        "validateTimeToCook"
      );

      expect(errors).toEqual(["The time to cook is required."]);
    });

    test("Should return error if timeToCook is not a number", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          timeToCook: "a3"
        },
        "validateTimeToCook"
      );

      expect(errors).toEqual(["The time to cook must be a number in minutes."]);
    });

    test("Should be successful if timeToCook is a number", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          timeToCook: 3
        },
        "validateTimeToCook"
      );

      expect(errors).toEqual([]);
    });

    test("Should be successful if timeToCook is a number string", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          timeToCook: "3"
        },
        "validateTimeToCook"
      );

      expect(errors).toEqual([]);
    });
  });

  describe("The validateIngredients function", () => {
    test("No ingredient is passed to the validator", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          ingredients: undefined
        },
        "validateIngredients"
      );

      expect(errors).toEqual(["The ingredients are required."]);
    });

    test("Ingredients is an invalid json string", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          ingredients: "invalid json"
        },
        "validateIngredients"
      );

      expect(errors).toEqual([
        "The ingredients must be a json list of ingredients."
      ]);
    });

    test("Ingredients is valid json string but it is not an array", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          ingredients: '{ "ex": 1 }'
        },
        "validateIngredients"
      );

      expect(errors).toEqual(["There must be a list of ingredients."]);
    });

    test("Ingredients is json array but it is empty", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          ingredients: "[]"
        },
        "validateIngredients"
      );

      expect(errors).toEqual(["There must be at least one ingredient."]);
    });

    test("Procedure is valid array with length >= 1", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          ingredients: '["step1", "step2"]'
        },
        "validateIngredients"
      );

      expect(errors).toEqual([]);
    });
  });

  describe("The validateImageUrl function", () => {
    test("Should return required error if no imageUrl is provided", () => {
      const [_, __, errors] = testStoreRecipeValidator({}, "validateImageUrl");

      expect(errors).toEqual(["The image url is required."]);
    });

    test("Should return invalid url error if imageUrl is an invalid web url", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          imageUrl: "invalid_url"
        },
        "validateImageUrl"
      );

      expect(errors).toEqual(["The image url must be a valid web url."]);
    });

    test("Should be successful if valid imageUrl is passed", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          imageUrl: "http://www.recipes.com/image.png"
        },
        "validateImageUrl"
      );

      expect(errors).toEqual([]);
    });
  });

  describe("The validateProcedure function", () => {
    test("No procedure is passed to the validator", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          procedure: undefined
        },
        "validateProcedure"
      );

      expect(errors).toEqual(["The procedure is required."]);
    });

    test("Procedure is an invalid json string", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          procedure: "invalid json"
        },
        "validateProcedure"
      );

      expect(errors).toEqual([
        "The procedure must be a json of procedural steps."
      ]);
    });

    test("Procedure is valid json string but it is not an array", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          procedure: '{ "ex": 1 }'
        },
        "validateProcedure"
      );

      expect(errors).toEqual(["There must be a list of procedure steps."]);
    });

    test("Procedure is valid json array but it is empty", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          procedure: "[]"
        },
        "validateProcedure"
      );

      expect(errors).toEqual(["There must be at least one procedure step."]);
    });

    test("Procedure is valid array with length >= 1", () => {
      const [_, __, errors] = testStoreRecipeValidator(
        {
          procedure: '["step1", "step2"]'
        },
        "validateProcedure"
      );

      expect(errors).toEqual([]);
    });
  });
});
