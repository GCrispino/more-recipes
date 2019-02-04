import middleware from "../../../middleware";
import { createResAndNextMocks } from "./utils";

const { authorize } = middleware;

describe("The authorize middleware", () => {
  test("Should call next when currentRecipe's id is from the authenticated user", async () => {
    const { res, next } = createResAndNextMocks();

    const id = "test-id";
    const req = {
      currentRecipe: { userId: id },
      authUser: { id }
    };

    await authorize(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.sendFailureResponse).not.toHaveBeenCalled();
  });

  test("Should call sendFailureResponse when currentRecipe's id is different from the authenticated user's id", async () => {
    const { res, next } = createResAndNextMocks();

    const req = {
      currentRecipe: { userId: "test-id" },
      authUser: { id: "another-test-id" }
    };

    await authorize(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendFailureResponse).toHaveBeenCalledWith(
      { message: "Unauthorized." },
      401
    );
  });
});
