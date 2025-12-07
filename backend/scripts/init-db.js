const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query("SELECT 1");
    console.log("Connected to database");

    const migrationPath = path.join(
      __dirname,
      "../migrations/001_initial_schema.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    await pool.query(migrationSQL);
    console.log("Database schema ready!");
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log("Database schema already exists, skipping...");
    } else {
      console.error("Error setting up database:", error.message);
      if (process.env.NODE_ENV !== "production") {
        process.exit(1);
      }
    }
  } finally {
    await pool.end();
  }
}

setupDatabase();
