import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Departement from "./departementModel";

export interface ArrondissementAttributes {
  id_arrondissement: number;
  libelle: string;
  id_departement: number;
}

interface ArrondissementCreationAttributes
  extends Optional<ArrondissementAttributes, "id_arrondissement"> { }

class Arrondissement
  extends Model<ArrondissementAttributes, ArrondissementCreationAttributes>
  implements ArrondissementAttributes {
  public id_arrondissement!: number;
  public libelle!: string;
  public id_departement!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Arrondissement.init(
  {
    id_arrondissement: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_departement: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Departement,
        key: 'id_departement',
      },
    },
  },
  {
    sequelize,
    modelName: "Arrondissement",
    tableName: "arrondissements",
    timestamps: false, // Automatically adds createdAt and updatedAt fields
  }
);

// Define association
Departement.hasMany(Arrondissement, { foreignKey: 'id_departement' });
Arrondissement.belongsTo(Departement, { foreignKey: 'id_departement' });

export default Arrondissement;
