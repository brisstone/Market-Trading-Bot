import axios, { AxiosError } from "axios";
import { getAuthToken } from "../middlewares/auth/botAuth";
import { Offer } from "../models/offers.model";
import { namespace } from "../utils/types/types";

export const getListingById = async (listingId: number) => {
  const authResponse = await getAuthToken();

  try {
    const response = await axios.get(
      `${process.env.CORE_BASE_URL}/bot/top_buy_bottom_sell?listing_id=${listingId}`,
      {
        headers: { Authorization: `Bearer ${authResponse.access_token}` },
      }
    );
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchListings = async () => {
  try {
    const listings = await axios.get(
      `${process.env.CORE_BASE_URL}/bot/listings`
    );

    let listingsData: namespace.RootListingObject[] = listings.data.data;

    return listingsData;
  } catch (error: any) {
    console.log(error, "error-fetching-listings-from-core");
    throw new Error(error);
  }
};

export const withdrawOfferFromMarket = async (offerId?: string) => {
  const authResponse = await getAuthToken();

  try {
    const response = await axios({
      method: "post",
      url: `${process.env.CORE_BASE_URL}/trade/withdraw_offer`,
      data: {
        trade_id: offerId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authResponse.access_token}`,
      },
    });

    if (response.data.status) {
      await Offer.update(
        {
          status: response?.data?.data?.status,
        },
        {
          where: { offerId: offerId },
        }
      );
    } else {
      await Offer.update(
        {
          status: "CANCELLED",
        },
        {
          where: { offerId: offerId },
        }
      );
    }
    return response;
  } catch (error: any) {
    console.error(error, "erorr--withdrawing-offer");
    throw new Error(error);
  }
};

export const placeOrders = async (
  listingId: string,
  quantity: number,
  amount: number,
  orderId: number,  
  url: string,
  source: string,
  offerType: string
) => {
  const authResponse = await getAuthToken();

  try {
    const response = await axios({
      method: "post",
      url: `${process.env.CORE_BASE_URL}/${url}`,
      data: {
        amount: amount,
        quantity: quantity,
        type: "LIMIT",
        listing_id: listingId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authResponse.access_token}`,
      },
    });

    console.log(response.data, "place order response-----", `${url}`);

    if (response.data.status) {
      await Offer.create({
        listingId: response?.data?.data?.listing_id,
        offerId: response?.data?.data?._id,
        orderId: orderId,
        amount: response?.data?.data?.amount,
        quantity: response?.data?.data?.quantity,
        offerType: response?.data?.data?.offer_type,
        status: response?.data?.data?.status,
        source,
        description: "SUCCESSFUL"
      });
    }else{
      await Offer.create({
        listingId: listingId,
        orderId: orderId,
        amount: amount,
        quantity: quantity,
        status: response?.data?.message,
        offerType,
        source,
        description: "SUCCESSFUL"
      });
    }

    return response;
  } catch (error: any) {
    console.log("error--placing--order", error);

    await Offer.create({
      listingId: listingId,
      orderId: orderId,
      amount: amount,
      quantity: quantity,
      description: error?.response?.data?.message || error?.message,
      status: "FAILED",
      source,
      offerType
    });

    throw new Error(error);
  }
};

export const getTradesInRage = async (
  listingId: number,
  buyTriggerPrice: number,
  sellTriggerPrice: number
) => {

  const authResponse = await getAuthToken();

  if (!authResponse) {
    console.error("error getting bot auth token from core");
    //save job as cancelled
    return;
  }

  try {
    const response = await axios.get(
      `${process.env.CORE_BASE_URL}/bot/trades_in_range?listing_id=${listingId}&buy_trigger_price=${buyTriggerPrice}&sell_trigger_price=${sellTriggerPrice}`,
      {
        headers: { Authorization: `Bearer ${authResponse.access_token}` },
      }
    );

    return await response.data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
