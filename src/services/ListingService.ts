import { Listing } from "../models/listings.model";
import * as MarketTakingService from "../services/MarketTakingService";

import * as MarketMakingService from "../services/MarketMakingService";
import { MarketMaking } from "../models/marketmaking.model";
import { MarketTaking } from "../models/markettaking.model";
export const updateListings = async (availableListings: any) => {
  try {
    const botListings = await Listing.findAll();

    for (let i = 0; i < availableListings.length; i++) {
      const foundListing = botListings.find(
        (botListing: any) =>
          availableListings[i]._id == botListing.toJSON().listingId
      );

      const data = {
        listingId: availableListings[i]._id,
        name: availableListings[i].artwork_name,
        artistName: availableListings[i].artist_name,
        price: availableListings[i].price,
      };

      if (foundListing) {
        //Update The listing on bot
        await Listing.update(data, {
          where: { listingId: availableListings[i]._id },
        });
      } else {
        //Add new Listing to bot
        await Listing.create(data);
      }
    }
    return;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getListings = async () => {
  const botListings = await Listing.findAll({
    attributes: ["name", "listingId", "id", "createdAt", "artistName", "price"],
    include: [
      { model: MarketMaking, as: "marketMaking" },
      { model: MarketTaking, as: "marketTaking" },
    ],
  });

  return botListings;
};

export const disableUnavailableListings = async (availableListings: any) => {
  const botListings = await Listing.findAll();

  //Disable Listing on the Bot if not availble at re-fetch
  for (let i = 0; i < botListings.length; i++) {
    const checkAvailability = availableListings?.find(
      (availableListing: any) =>
        availableListing._id == botListings[i].toJSON().listingId
    );

    if (!checkAvailability) {
      //If not found in local db, disable listing from bot Job

      await MarketMakingService.disableJob(botListings[i].toJSON().listingId);

      await MarketTakingService.disableJob(botListings[i].toJSON().listingId);
    }
  }

  return botListings;
};

export const findById = async (listingId: string) => {
  const dBListing = await Listing.findOne({
    where: {
      listingId: listingId,
    },
  });

  return { status: true, message: "Success", data: dBListing };
};
