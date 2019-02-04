export const createResAndNextMocks = () => ({
  res: {
    sendFailureResponse: jest.fn()
  },
  next: jest.fn()
});
