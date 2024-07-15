import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Commune from "./communeModel";

export interface SectionCommuneAttributes {
  id_sectioncommune: number;
  id_commune: number;
  libelle: string;

}

interface SectionCommuneCreationAttributes
  extends Optional<SectionCommuneAttributes, "id_sectioncommune"> { }

class SectionCommune
  extends Model<SectionCommuneAttributes, SectionCommuneCreationAttributes>
  implements SectionCommuneAttributes {
  public id_sectioncommune!: number;
  public id_commune!: number;
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

  },
  {
    sequelize,
    modelName: "SectionCommune",
    tableName: "sectioncommunes",
    timestamps: false, // Disable Sequelize's automatic timestamps
  }
);

// Define association
Commune.hasMany(SectionCommune, { foreignKey: 'id_commune', onDelete: "CASCADE" });
SectionCommune.belongsTo(Commune, { foreignKey: 'id_commune' });

export default SectionCommune;
