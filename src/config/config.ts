import dotenv from "dotenv";
import { Options } from "sequelize";

dotenv.config();

interface ConfigTs {
	development: Options;
	test: Options;
	production: Options;
}

const configDB: ConfigTs = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "postgres",
		dialectOptions: {
			charset: "utf8",
		},
		define: {
			timestamps: false,
		},
        pool: {
            max: 20000,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
	},
	test: {
		username: process.env.DB_USER_TEST,
		password: process.env.DB_PASSWORD_TEST,
		database: process.env.DB_NAME_TEST,
		host: process.env.DB_HOST_TEST,
		dialect: "postgres",
		dialectOptions: {
			charset: "utf8",
		},
		define: {
			timestamps: false,
		},
        pool: {
            max: 20000,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "postgres",
		dialectOptions: {
			charset: "utf8",
			multipleStatements: true,
		},
		logging: false,
		define: {
			timestamps: false,
		},
        pool: {
            max: 20000,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
	},
};
export default configDB;

module.exports = configDB;


