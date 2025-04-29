import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import Commune, { CommuneAttributes } from "./communeModel";


export interface AdresseAttributes {
  id_adresses: number;
  numero_rue: string;
  libelle_adresse: string;
  statut: string;
  id_commune: number;
  section_communale?: string;
  longitude?: number,
  latitude?: number;
  code_postal?: string;
  cle_unicite: string;
  from: string;
  commune?: CommuneAttributes;

}

interface AdresseCreationAttributes extends Optional<AdresseAttributes, "id_adresses"> { }

class Adresse extends Model<AdresseAttributes, AdresseCreationAttributes> implements AdresseAttributes {
  public id_adresses!: number;
  public numero_rue!: string;
  public libelle_adresse!: string;
  public cle_unicite!: string;
  public statut!: string;
  public id_commune!: number;
  public latitude!: number;
  public longitude!: number;
  public code_postal!: string;
  public section_communale!: string;
  public from!: string;
  commune: any;

}
Adresse.init(
  {
    id_adresses: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
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
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cle_unicite: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    statut: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'En creation',
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
    modelName: "adresse",
    tableName: "adresses",
    timestamps: false, // Disable Sequelize's automatic timestamps
  }
);

// Define associations
Commune.hasMany(Adresse, { foreignKey: 'id_commune', onDelete: "CASCADE" });
Adresse.belongsTo(Commune, { foreignKey: 'id_commune' });



export default Adresse;