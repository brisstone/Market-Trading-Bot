import { MarketTaking } from "../models/markettaking.model";
import { MTQueue } from "../queues/MTQueueing";

import { Listing, Listing as ListingModel } from "../models/listings.model";

const jobQueue = new MTQueue();

export const createJob = async (data: any) => {
  const listing = await Listing.findOne({
    where: { listingId: data.listingId },
  });

  if (!listing) {
    return { status: false, message: "Listing doest not exist" };
  }

  const marketTaking = await MarketTaking.findOne({
    where: { listingId: data.listingId },
  });

  if (marketTaking) {
    if (marketTaking?.toJSON().jobEnabled) {
      return {
        message: "JOB Already Placed",
      };
    } else {
      const { status, message, repeatJobKey } = await jobQueue.addJobToQueue(
        data
      );

      if (!status) {
        return { status, message };
      }

      //If the job is successfully queued

      await marketTaking.update(
        {
          listingId: data.listingId,
          name: listing.name,
          triggerSpread: data.triggerSpread,
          jobEnabled: true,
          repeatJobKey: repeatJobKey,
        },
        {
          where: { listingId: data.listingId },
        }
      );

      return { status: true, message: "JOB Re-Queued" };
    }
  } else {
    const response = await jobQueue.addJobToQueue(data);

    //If the job is successfully queued
    if (response.status && response!.repeatJobKey) {
      await MarketTaking.create({
        listingId: listing.listingId,
        name: listing.name,
        volumePerOrder: data.quantityPerOrder,
        triggerSpread: data.triggerSpread,
        repeatJobKey: response!.repeatJobKey,
      });
    }

    return { status: true, message: response.message };
  }
};

export const disableJob = async (data: any) => {
  const job = await MarketTaking.findOne({
    where: { listingId: data.listingId },
  });

  if (job) {
    if (job.toJSON().repeatJobKey) {
      const response = await jobQueue.removeJobFromQueue(
        job.toJSON().repeatJobKey
      );

      if (response) {
        await MarketTaking.update(data, {
          where: { listingId: data.listingId },
        });

        return { status: true, message: "JOB Disabled" };
      } else {
        return { status: false, message: "JOB error removing from queue" };
      }
    } else {
      return { status: false, message: "JOB Id Can't be tracked on Queue" };
    }
  } else {
    return { status: false, message: "JOB doesn't exist" };
  }
};

export const findByListingId = async (listingId: string) => {
  const dBJob = await MarketTaking.findOne({
    where: {
      listingId: listingId,
    },
    include: { model: ListingModel, as: "listing" },
  });
  return { status: true, message: "Success", data: dBJob };
};
