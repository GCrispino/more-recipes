import middleware from "../../../middleware";
import { User, Recipe } from "../../../database/models";

import { createResAndNextMocks } from "./utils";

const { hasRecipe } = middleware;

describe("The hasRecipe middleware", async () => {
  beforeEach(() => Recipe.destroy({ where: {} }));

  test("Should call next if recipe exists", async () => {
    const recipe = await Recipe.create({});
    const req = {
      params: {
        recipeId: recipe.id
      }
    };
    const { res, next } = createResAndNextMocks();

    await hasRecipe(req, res, next);
    // assertions...
    expect(next).toHaveBeenCalled();
    expect(res.sendFailureResponse).not.toHaveBeenCalled();
    expect(req.currentRecipe).toBeDefined();
  });

  test("Should call sendFailureResponse if recipe does not exist", async () => {
    const { res, next } = createResAndNextMocks();

    const req = {
      params: {
        recipeId: null
      }
    };

    await hasRecipe(req, res, next);
    // assertions...
    expect(next).not.toHaveBeenCalled();
    expect(res.sendFailureResponse).toHaveBeenCalledWith(
      { message: "Recipe not found." },
      404
    );
  });

  test("Should call sendFailureResponse if error is thrown", async () => {
    const { res, next } = createResAndNextMocks();

    await hasRecipe(undefined, res, next);
    // assertions...
    expect(next).not.toHaveBeenCalled();
    expect(res.sendFailureResponse).toHaveBeenCalledWith(
      { message: "Recipe not found." },
      404
    );
  });
});
