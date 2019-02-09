// @ts-check
import supertest from "supertest";
import faker from "faker";

import app from "../../../index";
import { generateRecipe, generateUser } from "../../utils/generate";
import { Recipe } from "../../../database/models";

describe("The recipe favoriting process", () => {
  test("Should add and remove recipe to favorites", async () => {
    const { token } = await generateUser();
    const fakeRecipe = await Recipe.create(generateRecipe());

    const {
      body: {
        data: { message: firstMessage }
      }
    } = await supertest(app)
      .post(`/api/v1/users/${fakeRecipe.id}/favorites`)
      .send({ access_token: token });

    expect(firstMessage).toBe("Recipe favorited.");

    const {
      body: {
        data: { message: secondMessage }
      }
    } = await supertest(app)
      .post(`/api/v1/users/${fakeRecipe.id}/favorites`)
      .send({ access_token: token });

    expect(secondMessage).toBe("Recipe removed from favorites.");
  });
});
