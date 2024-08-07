import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import SectionCommunale from "./sectionCommunalModel";


export interface AdresseAttributes {
  id_adresses: number;
  numero_rue: string;
  libelle: string;
  cle_unicite: string;
  statut: string;
  code_postal: string,
  id_sectioncommune: number;

}

interface AdresseCreationAttributes extends Optional<AdresseAttributes, "id_adresses"> { }

class Adresse extends Model<AdresseAttributes, AdresseCreationAttributes> implements AdresseAttributes {
  public id_adresses!: number;
  public numero_rue!: string;
  public libelle!: string;
  public cle_unicite!: string;
  public statut!: string;
  public code_postal!: string;
  public id_sectioncommune!: number;

}
Adresse.init(
  {
    id_adresses: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    numero_rue: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cle_unicite: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    statut: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'En creation', // assuming default status
    },
    code_postal: {
      type: DataTypes.STRING(20),
      allowNull: false,

    },
    id_sectioncommune: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: SectionCommunale,
        key: 'id_sectioncommune',
      },
      onDelete: "CASCADE"
    },

  },
  {
    sequelize,
    modelName: "Adresse",
    tableName: "adresses",
    timestamps: false, // Disable Sequelize's automatic timestamps
  }
);

// Define associations
SectionCommunale.hasMany(Adresse, { foreignKey: 'id_sectioncommune', onDelete: "CASCADE" });
Adresse.belongsTo(SectionCommunale, { foreignKey: 'id_sectioncommune' });



export default Adresse;
