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
  export interface Order
    extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    id: CreationOptional<number>;
    listingId: string;
    buyOrders: string;
    sellOrders: string;
    buyTriggerPrice?: number;
    sellTriggerPrice?: number;
  }
}
