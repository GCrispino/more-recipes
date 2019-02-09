// @ts-check
import supertest from "supertest";

import app from "../../../index";
import { generateRecipe, generateUser } from "../../utils/generate";
import { Recipe } from "../../../database/models";

async function favoriteRecipe(recipeId, token) {
  const { body } = await supertest(app)
    .post(`/api/v1/users/${recipeId}/favorites`)
    .send({ access_token: token });

  return body;
}

describe("The recipe favoriting process", () => {
  test("Should add and remove recipe to favorites", async () => {
    const { token } = await generateUser();
    const fakeRecipe = await Recipe.create(generateRecipe());

    const {
      data: { message: firstMessage }
    } = await favoriteRecipe(fakeRecipe.id, token);

    expect(firstMessage).toBe("Recipe favorited.");

    const {
      data: { message: secondMessage }
    } = await favoriteRecipe(fakeRecipe.id, token);

    expect(secondMessage).toBe("Recipe removed from favorites.");
  });
});
