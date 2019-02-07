import faker from "faker";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../../database/models";
import config from "../../config/index";

export const generateUser = async () => {
  const fakeUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  const user = await User.create({
    ...fakeUser,
    password: bcrypt.hashSync(fakeUser.password, 1)
  });

  const token = jwt.sign({ email: user.email }, config.JWT_SECRET);

  return { fakeUser, user, token };
};

export const generateRecipe = async () => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.sentences(2),
  timeToCook: 40,
  imageUrl: faker.internet.url(),
  ingredients: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()]),
  procedure: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()])
});
