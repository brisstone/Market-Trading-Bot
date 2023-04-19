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
  export interface Listing
    extends Model<InferAttributes<Listing>, InferCreationAttributes<Listing>> {
    id: CreationOptional<number>;
    listingId: string;
    name: string;
    artistName: string;
    topBuy?: decimal;
    price: decimal;
    bottomSell?: decimal;
    createdAt?: CreationOptional<Date>;
    updatedAt?: CreationOptional<Date>;
  }
}
