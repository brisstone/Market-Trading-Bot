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
  export interface MarketTaking
    extends Model<InferAttributes<MarketTaking>, InferCreationAttributes<MarketTaking>> {
    id: CreationOptional<number>;
    listingId: string;
    repeatJobKey: string;
    name: string;
    triggerSpread: number;
    volumePerOrder?: number;
    jobEnabled?: CreationOptional<boolean>;
    listingEnabled?: CreationOptional<boolean>;
   
  }
}
