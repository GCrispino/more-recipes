// @ts-check
import supertest from "supertest";
import faker from "faker";

import app from "../../../index";
import { generateRecipe, generateUser } from "../../utils/generate";
import { Recipe } from "../../../database/models";

describe("The update recipe process", () => {
  test("Should not update anything if user is not logged in", async () => {
    const { user } = await generateUser();
    const fakeRecipe = generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id
    });

    const { body } = await supertest(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence()
      })
      .expect(401);

    const {
      status,
      data: { message }
    } = body;

    expect(status).toBe("fail");
    expect(message).toBe("Unauthenticated.");

    // get from db
    const recipeFromDB = await Recipe.findById(recipe.id);
    expect(recipeFromDB.title).toBe(recipe.title);
    expect(recipeFromDB.description).toBe(recipe.description);
  });

  test("Should not update anything if recipe does not exist", async () => {
    const { token } = await generateUser();

    const { body } = await supertest(app)
      .put(`/api/v1/recipes/${faker.random.uuid()}`)
      .send({ access_token: token })
      .expect(404);

    const {
      status,
      data: { message }
    } = body;

    expect(status).toBe("fail");
    expect(message).toBe("Recipe not found.");
  });

  test("Should update recipe's title", async () => {
    const { user, token } = await generateUser();
    const fakeRecipe = generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id
    });

    const newTitle = faker.lorem.sentence();

    const { body } = await supertest(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        access_token: token,
        title: newTitle
      })
      .expect(200);

    const {
      status,
      data: { recipe: updatedRecipe }
    } = body;

    expect(status).toBe("success");
    expect(updatedRecipe.title).toBe(newTitle);

    // get from db
    const recipeFromDB = await Recipe.findById(recipe.id);
    expect(recipeFromDB.title).toBe(newTitle);
  });

  test("Should update recipe's description", async () => {
    const { user, token } = await generateUser();
    const fakeRecipe = generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id
    });

    const newDescription = faker.lorem.sentence();

    const { body } = await supertest(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        access_token: token,
        description: newDescription
      })
      .expect(200);

    const {
      status,
      data: { recipe: updatedRecipe }
    } = body;

    expect(status).toBe("success");
    expect(updatedRecipe.description).toBe(newDescription);

    // get from db
    const recipeFromDB = await Recipe.findById(recipe.id);
    expect(recipeFromDB.description).toBe(newDescription);
  });

  test("Should update all recipe's fields", async () => {
    const { user, token } = await generateUser();
    const fakeRecipe = generateRecipe();
    const newRecipe = generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id
    });

    const { body } = await supertest(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        access_token: token,
        ...newRecipe
      })
      .expect(200);

    const {
      status,
      data: { recipe: updatedRecipe }
    } = body;

    expect(status).toBe("success");
    expect(updatedRecipe.title).toBe(newRecipe.title);
    expect(updatedRecipe.description).toBe(newRecipe.description);
    expect(updatedRecipe.imageUrl).toBe(newRecipe.imageUrl);
    expect(updatedRecipe.timeToCook).toBe(newRecipe.timeToCook);
    expect(updatedRecipe.ingredients).toBe(newRecipe.ingredients);
    expect(updatedRecipe.procedure).toBe(newRecipe.procedure);

    // get from db
    const recipeFromDB = await Recipe.findById(recipe.id);
    expect(recipeFromDB.title).toBe(newRecipe.title);
    expect(recipeFromDB.description).toBe(newRecipe.description);
    expect(recipeFromDB.imageUrl).toBe(newRecipe.imageUrl);
    expect(recipeFromDB.timeToCook).toBe(newRecipe.timeToCook);
    expect(recipeFromDB.ingredients).toBe(newRecipe.ingredients);
    expect(recipeFromDB.procedure).toBe(newRecipe.procedure);
  });
});
