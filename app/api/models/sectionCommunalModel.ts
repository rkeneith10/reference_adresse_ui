import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Ville from "./villeModel";

export interface SectionCommuneAttributes {
  id_sectioncommune: number;
  id_ville: number;
  libelle: string;
}

interface SectionCommuneCreationAttributes
  extends Optional<SectionCommuneAttributes, "id_sectioncommune"> { }

class SectionCommune
  extends Model<SectionCommuneAttributes, SectionCommuneCreationAttributes>
  implements SectionCommuneAttributes {
  public id_sectioncommune!: number;
  public id_ville!: number;
  public libelle!: string;
  public creationdateheureinit!: string;
  public modificationdateheureinit!: string;
}

SectionCommune.init(
  {
    id_sectioncommune: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_ville: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Ville,
        key: 'id_ville',
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
    modelName: "SectionCommune",
    tableName: "sectioncommunes",
    timestamps: false, // Disable Sequelize's automatic timestamps
  }
);

// Define association
Ville.hasMany(SectionCommune, { foreignKey: 'id_ville', onDelete: "CASCADE" });
SectionCommune.belongsTo(Ville, { foreignKey: 'id_ville' });

export default SectionCommune;
