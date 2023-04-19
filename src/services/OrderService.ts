import { Order } from "../models/orders.model";

import { Listing } from "../models/listings.model";
import { IJobOrders } from "../utils/types/types";

export const getAllOrders = async () => {
  const botOrders = await Order.findAll();
  return { status: true, message: "Success", data: botOrders };
};

export const getById = async (id: string) => {
  const botOrders = await Order.findOne({ where: { id } });
  return { status: true, message: "Success", data: botOrders };
};

export const createOrder = async (
  listingId: string,
  sellDetails: string,
  buyDetails: string,
  buyTriggerPrice: number,
  sellTriggerPrice: number
) => {
  const DbOrder = await Order.create({
    listingId: listingId,
    buyOrders: buyDetails,
    sellOrders: sellDetails,
    buyTriggerPrice,
    sellTriggerPrice
  });
  return { status: true, message: "Success", data: DbOrder };
};

export const updateListingOrder = async (
  data: IJobOrders,
  listingId: number
) => {
  try { 
    const listing = await Listing.update(
      { topBuy: data?.topBuy, bottomSell: data?.bottomSell },
      { where: { listingId: listingId } }
    );
    return listing;
  } catch (error: any) {
    console.log(error, "Listing-update-error");
    throw new error();
  }
};
