import { createClient } from "then-redis";
import { createClient as createClientMock } from "redis-mock";
/**
 * Create a new client redis
 * @returns {object} fake-redis client for testing and real redis-client in production
 */
const getRedisClient = () => {
  if (process.env.NODE_ENV === "production") {
    return createClient(process.env.REDIS_URL);
  }

  // if (process.env.NODE_ENV === "test") {
  //   return createClientMock();
  // }

  return createClient();
};

export default getRedisClient();
