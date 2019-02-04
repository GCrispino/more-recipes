import middleware from "../../../middleware";
import { User, Recipe } from "../../../database/models";

const { hasRecipe } = middleware;

const createResAndNextMocks = () => ({
  res: {
    sendFailureResponse: jest.fn()
  },
  next: jest.fn()
});

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

  test.skip("Should call sendFailureResponse if recipe does not exist", () => {});
  test.skip("Should call sendFailureResponse if error is thrown", () => {});
});
