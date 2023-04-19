import { DataTypes } from "sequelize";
import {sequelize} from "../config/sequelize";
import { namespace } from "../utils/types/models/orders";
import Order = namespace.Order;

//At scheduled time, order are created before bot goes to the market

export const Order = sequelize.define<Order>(
  "Order",
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
    buyOrders: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sellOrders: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    buyTriggerPrice: {
      type: DataTypes.DECIMAL,
    },
    sellTriggerPrice:{
      type: DataTypes.DECIMAL,
    },
  },
  {
    // Other model options go here
    timestamps: true,
    modelName: "Order",
  }
);
