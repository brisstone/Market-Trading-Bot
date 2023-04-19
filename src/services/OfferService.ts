import { Offer } from "../models/offers.model";
import { withdrawOfferFromMarket } from "./ArtsplitCoreService";

export const getAllOffers = async () => {
  const botOffers = await Offer.findAll();

  return {
    status: true,
    message: "Success",
    data: botOffers,
  };
};

export const getOffersByOrderId = async (orderId: string) => {
  const botOffers = await Offer.findAll({ where: { orderId: orderId } });

  return {
    status: true,
    message: "Success",
    data: botOffers,
  };
};

export const withdrawOffers = async (listingId: string) => {
  console.log("withdrawing offers.....");

  try {
    const placedOffers = await Offer.findAll({
      where: { status: "INITIATED", listingId: listingId },
    });

    for (let i = 0; i < placedOffers.length; i++) {
      const offerplaced = placedOffers[i].toJSON();
      await withdrawOfferFromMarket(offerplaced.offerId);
    }
    
    console.log(`offers withdrawn for ${listingId}`);
    return;

  } catch (error) {
    console.error(error, "error-withdrawing-offer");
  }
};
