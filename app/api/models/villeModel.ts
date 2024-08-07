import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Commune from "./communeModel";

export interface VilleAttributes {
  id_ville: number;
  id_commune: number;
  libelle: string;
  longitude: string;
  lattitude: string;
}

interface VilleCreationAttributes
  extends Optional<VilleAttributes, "id_ville"> { }



class Ville
  extends Model<VilleAttributes, VilleCreationAttributes>
  implements VilleAttributes {
  public id_ville!: number;
  public id_commune!: number;
  public libelle!: string;
  public longitude!: string;
  public lattitude!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ville.init(
  {
    id_ville: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_commune: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Commune,
        key: 'id_commune',
      },
      onDelete: "CASCADE"
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    longitude: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lattitude: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },



  },
  {
    sequelize,
    modelName: "Ville",
    tableName: "villes",
    timestamps: false,
  }
);

Commune.hasMany(Ville, { foreignKey: "id_commune", onDelete: "CASCADE" })
Ville.belongsTo(Commune, { foreignKey: "id_commune" })

export default Ville;