import { Options, Sequelize } from "sequelize";
import configDB from "./config";

const env: string = process.env.NODE_ENV || "development";

const config: Options = configDB[env as keyof typeof configDB];


export const sequelize: Sequelize = new Sequelize(
  config.database!,
  config.username!,
  config.password,
  {
    host: config.host,
    dialect: "postgres",
    // operatorsAliases: false,
    logging: false,
    pool: {
      max: config!.pool!.max,
      min: config!.pool!.min,
      acquire: config!.pool!.acquire,
      idle: config!.pool!.idle,
    },
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

sequelize.authenticate();




