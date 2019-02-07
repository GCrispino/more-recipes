import supertest from "supertest";
import app from "../../../index";

import { generateUser, generateRecipe } from "../../utils/generate";
import { Recipe } from "../../../database/models";

describe("The create recipe process", () => {
  test("should create recipe and return recipe details", async () => {
    const fakeRecipe = await generateRecipe();

    const { user: _, token: access_token } = await generateUser();

    const response = await supertest(app)
      .post("/api/v1/recipes")
      .send({ ...fakeRecipe, access_token })
      .expect(201);

    const { recipe } = response.body.data;
    expect(response.body.status).toBe("success");
    expect(recipe.title).toBe(fakeRecipe.title);
    expect(recipe.description).toBe(fakeRecipe.description);

    const recipeFromDB = await Recipe.findById(recipe.id);

    expect(recipeFromDB).toBeTruthy();
  });
});
