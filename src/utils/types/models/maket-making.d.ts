import {
  Sequelize,
  ModelDefined,
  Association,
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  NonAttribute,
  CreationAttributes,
  BelongsToGetAssociationMixin,
  ModelAttributes,
  AssociationOptions,
  HasOneGetAssociationMixin,
  ForeignKey,
} from "sequelize";

export namespace namespace {
  export interface MarketMaking
    extends Model<InferAttributes<MarketMaking>, InferCreationAttributes<MarketMaking>> {
    id: CreationOptional<number>;
    listingId: string;
    repeatJobKey?: string;
    name: string;
    spread: CreationOptional<number>;
    volumePerOrder: number;
    jobEnabled?: CreationOptional<boolean>;
    listingEnabled?: CreationOptional<boolean>;
    interval: number,
    orderline: number,
  }
}
