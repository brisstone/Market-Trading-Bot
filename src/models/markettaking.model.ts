import { DataTypes } from "sequelize";
import {sequelize} from "../config/sequelize";
import { Listing } from "./listings.model";
import { namespace } from "../utils/types/models/maket-taking";
import MarketTaking = namespace.MarketTaking;

export const MarketTaking = sequelize.define<MarketTaking>(
  "MarketTaking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listingId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    triggerSpread: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    repeatJobKey: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    jobEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    listingEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // Other model options go here
    timestamps: true,
    modelName: "MarketTaking",
  }
);

Listing.hasOne(MarketTaking, {
  foreignKey: "listingId",
  sourceKey: "listingId",
  as: "marketTaking",
});

MarketTaking.belongsTo(Listing, {
  foreignKey: "listingId",
  targetKey: "listingId",
  as: "listing",
});
