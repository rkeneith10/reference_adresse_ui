import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  port: 3306,
  host: "localhost",
  username: "root",
  password: "RSKeneith1210",
  database: "referentieldb",
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
