import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface CountryAttributes {
  id_pays: number;
  libelle: string;
  code_pays: string;
  continent: string;
  indicatif_tel: string;
  fuseau_horaire: string;

  // creationdateheureinit: string;
  // modificationdateheureinit: string;
}

interface CountryCreationAttributes
  extends Optional<CountryAttributes, "id_pays"> {}

class Country
  extends Model<CountryAttributes, CountryCreationAttributes>
  implements CountryAttributes
{
  public id_pays!: number;
  public libelle!: string;
  public code_pays!: string;

  public continent!: string;
  public indicatif_tel!: string;
  public fuseau_horaire!: string;

  // public creationdateheureinit!: string;
  // public modificationdateheureinit!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Country.init(
  {
    id_pays: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code_pays: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    continent: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    indicatif_tel: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    fuseau_horaire: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // creationdateheureinit: {
    //   type: DataTypes.STRING(100),
    //   allowNull: false,
    // },
    // modificationdateheureinit: {
    //   type: DataTypes.STRING(100),
    //   allowNull: false,
    // },
  },
  {
    sequelize,
    modelName: "Country",
    tableName: "countries",
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default Country;
