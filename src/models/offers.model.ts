import { DataTypes } from "sequelize";
import {sequelize} from "../config/sequelize";
import { namespace } from "../utils/types/models/offers";
import Offer = namespace.Offer;


//After the bot goes to the market, the response from the market is stored in this table

export const Offer = sequelize.define<Offer>(
  "Offer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    listingId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offerId: {
      type: DataTypes.STRING,
    },
    offerType: {
      type: DataTypes.STRING,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL,
    },
    quantity: {
      type: DataTypes.DECIMAL,
    },
    source: {
      type: DataTypes.STRING,
    },
    description:{
      type: DataTypes.STRING,
    },
    
  },
  {
    // Other model options go here
    timestamps: true,
    modelName: "Offer",
  }
);
