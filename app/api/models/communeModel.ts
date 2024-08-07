import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Departement from "./departementModel";

export interface CommuneAttributes {
  id_commune: number;
  id_departement: number;
  libelle: string;
}

interface CommuneCreationAttributes
  extends Optional<CommuneAttributes, "id_commune"> { }

class Commune
  extends Model<CommuneAttributes, CommuneCreationAttributes>
  implements CommuneAttributes {
  public id_commune!: number;
  public id_departement!: number;
  public libelle!: string;





  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Commune.init(
  {
    id_commune: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_departement: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Departement,
        key: 'id_departement',
      },
      onDelete: "CASCADE"
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },




  },
  {
    sequelize,
    modelName: "Commune",
    tableName: "communes",
    timestamps: false, // Automatically adds createdAt and updatedAt fields
  }
);

// Define association
Departement.hasMany(Commune, { foreignKey: 'id_departement', onDelete: "CASCADE" });
Commune.belongsTo(Departement, { foreignKey: 'id_departement' });

export default Commune;
