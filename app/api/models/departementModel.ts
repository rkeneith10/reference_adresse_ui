
import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Country, { CountryAttributes } from "./paysModel";

export interface DepartementAttributes {
  id_departement: number;
  libelle_departement: string;
  code_departement?: string;
  chef_lieux?: string;
  id_pays: number;
  Country?: CountryAttributes;
}

interface DepartementCreationAttributes
  extends Optional<DepartementAttributes, "id_departement"> { }

class Departement
  extends Model<DepartementAttributes, DepartementCreationAttributes>
  implements DepartementAttributes {
  public id_departement!: number;
  public libelle_departement!: string;
  public code_departement!: string;
  public chef_lieux!: string;
  public id_pays!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Departement.init(
  {
    id_departement: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    libelle_departement: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code_departement: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    chef_lieux: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    id_pays: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Country,
        key: 'id_pays',
      },
      onDelete: "CASCADE"
    },
  },
  {
    sequelize,
    modelName: "departement",
    tableName: "departements",
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Define association
Country.hasMany(Departement, { foreignKey: 'id_pays', onDelete: "CASCADE" });
Departement.belongsTo(Country, { foreignKey: 'id_pays' });

export default Departement;
