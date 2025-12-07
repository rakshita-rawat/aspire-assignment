import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

dotenv.config();

export const pool = ((): Pool => {
  const config: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  if (!config.connectionString) {
    throw new Error(
      "Database configuration is missing. Please set DATABASE_URL in .env file."
    );
  }

  return new Pool(config);
})();

export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT NOW()");
    logger.info("Database connection successful", {
      databaseTime: result.rows[0].now,
    });
    return true;
  } catch (error: unknown) {
    logger.error("Database connection failed", error);
    return false;
  }
};
