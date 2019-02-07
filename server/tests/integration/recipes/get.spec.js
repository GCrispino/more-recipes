import supertest from "supertest";
import app from "../../../index";

import { generateRecipe } from "../../utils/generate";
import { Recipe } from "../../../database/models";

describe("The getRecipe endpoint", () => {
  test("can get a single recipe by id", async () => {
    const recipe = await Recipe.create(generateRecipe());

    const response = await supertest(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.recipe.id).toBe(recipe.id);
    expect(response.body.data.recipe.title).toBe(recipe.title);
  });

  test("returns a 404 if recipe is not found", async () => {
    const {
      body: {
        data: { message }
      }
    } = await supertest(app)
      .get("/api/v1/recipes/fakeId")
      .expect(404);

    expect(message).toBe("Recipe not found.");
  });
});
