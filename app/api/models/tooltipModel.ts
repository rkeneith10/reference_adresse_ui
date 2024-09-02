import sequelize from "@/lib/sequelize";
import { DataTypes, Model, Optional } from "sequelize";

// Define the attributes interface
export interface TooltipAttributes {
  id_tooltip: number;
  nom_application: string;
  nom_champ: string;
  message_tooltip: string;
}

// Define the creation attributes interface
interface TooltipCreationAttributes extends Optional<TooltipAttributes, "id_tooltip"> { }

// Define the Tooltip model
class Tooltip extends Model<TooltipAttributes, TooltipCreationAttributes> implements TooltipAttributes {
  public id_tooltip!: number;
  public nom_application!: string;
  public nom_champ!: string;
  public message_tooltip!: string;
}

// Initialize the model
Tooltip.init(
  {
    id_tooltip: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nom_application: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nom_champ: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message_tooltip: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tooltip",
    tableName: "tooltips",
    timestamps: false, // Disable Sequelize's automatic timestamps
  }
);

export default Tooltip;
