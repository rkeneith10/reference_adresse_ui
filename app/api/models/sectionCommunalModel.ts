import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Ville from "./villeModel";

export interface SectionCommunaleAttributes {
  id_sectioncommunale: number;
  id_ville: number;
  libelle_sectioncommunale: string;
}

interface SectionCommunaleCreationAttributes
  extends Optional<SectionCommunaleAttributes, "id_sectioncommunale"> { }

class SectionCommunale
  extends Model<SectionCommunaleAttributes, SectionCommunaleCreationAttributes>
  implements SectionCommunaleAttributes {
  public id_sectioncommunale!: number;
  public id_ville!: number;
  public libelle_sectioncommunale!: string;
  public creationdateheureinit!: string;
  public modificationdateheureinit!: string;
}

SectionCommunale.init(
  {
    id_sectioncommunale: {
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
    libelle_sectioncommunale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

  },
  {
    sequelize,
    modelName: "SectionCommunale",
    tableName: "sectioncommunale",
    timestamps: false, // Disable Sequelize's automatic timestamps
  }
);

// Define association
Ville.hasMany(SectionCommunale, { foreignKey: 'id_ville', onDelete: "CASCADE" });
SectionCommunale.belongsTo(Ville, { foreignKey: 'id_ville' });

export default SectionCommunale;
