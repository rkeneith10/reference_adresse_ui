import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Commune from "./communeModel";


export interface AdresseAttributes {
  id_adresses: number;
  numero_rue: string;
  libelle_adresse: string;
  statut: string;
  id_commune: number;
  section_communale: string;
  code_postal?: string;
  cle_unicite: string;
  from: string;

}

interface AdresseCreationAttributes extends Optional<AdresseAttributes, "id_adresses"> { }

class Adresse extends Model<AdresseAttributes, AdresseCreationAttributes> implements AdresseAttributes {
  public id_adresses!: number;
  public numero_rue!: string;
  public libelle_adresse!: string;
  public cle_unicite!: string;
  public statut!: string;
  public id_commune!: number;
  public code_postal!: string;
  public section_communale!: string;
  public from!: string;

}
Adresse.init(
  {
    id_adresses: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull:false,
      primaryKey: true,
    },
    numero_rue: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    libelle_adresse: {
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
      allowNull: true,

    },

    section_communale: {
      type: DataTypes.STRING(20),
      allowNull: true,

    },
    id_commune: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Commune,
        key: 'id_commune',
      },

      onDelete: "CASCADE"
    },
    from: {
      type: DataTypes.STRING(20),
      allowNull: false,

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
Commune.hasMany(Adresse, { foreignKey: 'id_commune', onDelete: "CASCADE" });
Adresse.belongsTo(Commune, { foreignKey: 'id_commune' });



export default Adresse;
