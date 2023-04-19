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
  export interface Offer
    extends Model<InferAttributes<Offer>, InferCreationAttributes<Offer>> {
    id: CreationOptional<number>;
    listingId: string;
    offerId?: string;
    offerType: string;
    orderId: number;
    status: string;
    amount: number;
    quantity: number;
    source: string;
    description: string;
   
  }
}
