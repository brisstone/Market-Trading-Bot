import { DataTypes } from "sequelize";
import {sequelize} from "../config/sequelize";
import { namespace } from "../utils/types/models/listings";
import Listing = namespace.Listing;


export const Listing = sequelize.define<Listing>(
  "Listing",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    listingId: { 
      type: new DataTypes.STRING,
			allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    artistName: {
      type: DataTypes.STRING,
    },
    topBuy: {
      type: DataTypes.DECIMAL,
    },
    bottomSell: {
      type: DataTypes.DECIMAL,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    timestamps: true,
    modelName: "Listing",
  }
);