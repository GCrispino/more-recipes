import supertest from "supertest";
import app from "../../../index";

import { generateUser, generateRecipe } from "../../utils/generate";
import { Recipe } from "../../../database/models";

describe("The delete recipe endpoint", () => {
  test("deletes recipe from database and returns message", async () => {
    const { user, token } = await generateUser();

    const fakeRecipe = await generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id
    });

    const response = await supertest(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .send({ access_token: token })
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.message).toBe("Recipe deleted.");

    const recipeFromDB = await Recipe.findAll({ where: { id: recipe.id } });

    // get recipe from db
    expect(recipeFromDB.length).toBe(0);
  });
});
