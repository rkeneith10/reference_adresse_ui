import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  port: 3306,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: "mysql",
  dialectModule: require("mysql2"),
});
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL");
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
})();
export default sequelize;
