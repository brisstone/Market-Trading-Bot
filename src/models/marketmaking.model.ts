
import { DataTypes } from 'sequelize';
import {sequelize} from "../config/sequelize";
import { Listing } from './listings.model';
import { namespace } from "../utils/types/models/maket-making";
import MarketMaking = namespace.MarketMaking;

export const MarketMaking = sequelize.define<MarketMaking>("MarketMaking", {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  listingId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  repeatJobKey: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  spread: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  volumePerOrder: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  jobEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
    
  },
  listingEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
    
  },
  interval: {
    type: DataTypes.INTEGER
    
  },
  orderline:{
    type: DataTypes.INTEGER
  }

}, {

  // Other model options go here
  timestamps: true,
  modelName: 'MarketMaking' 
});


Listing.hasOne(MarketMaking, {
  foreignKey: "listingId",
  sourceKey: "listingId",
  as: "marketMaking",
});


MarketMaking.belongsTo(Listing, {
  foreignKey: 'listingId',
  targetKey:"listingId",
  as: "listing"
});

