import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
});

const sync = async () => {
  try {
    await db.sync({ force: false });
    console.log("Database synced successfully");
  } catch (err) {
    console.error("Failed to sync database:", err);
  }
};

const close = async () => {
  try {
    await db.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Failed to close database connection:", err);
  }
};

export { db, sync, close };
