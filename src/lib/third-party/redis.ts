import Redis from "ioredis";
import { logger } from "@/lib/utils/logger";

/**
 * Redis client for interacting with Redis database
 * Using Upstash Redis connection from environment variables
 */
const redisUrl = process.env.REDIS_URL;
const redisEnabled = process.env.REDIS_ENABLED === "true";

// Create Redis client only if Redis is enabled and URL is provided
const client = redisEnabled && redisUrl
  ? new Redis(redisUrl)
  : null;

/**
 * Initialize Redis connection
 */
export const initRedis = async () => {
  if (!redisEnabled) {
    logger.error('Redis is disabled by configuration');
    return null;
  }

  if (!redisUrl) {
    logger.error('Redis URL not provided in environment variables');
    return null;
  }

  try {
    // Test connection
    await client?.set('foo', 'bar');
    logger.info('Redis connection established successfully');
    return client;
  } catch (error) {
    logger.error ('Redis connection failed:', error);
    throw error;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = () => {
  return client;
};
