import { Sequelize } from "sequelize";


const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  dialect: "mysql",
  dialectModule: require("mysql2"),
});
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL");
    await sequelize.sync({ alter: false, force: false });
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
})();
export default sequelize;
