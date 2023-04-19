import { MarketMaking } from "../models/marketmaking.model";
import { JobQueue } from "../queues/MMQueueing";

import { Listing, Listing as ListingModel } from "../models/listings.model";

const jobQueue = new JobQueue();

export const createJob = async (data: any) => {
  const listing = await Listing.findOne({
    where: { listingId: data.listingId },
  });

  if (!listing) {
    return { status: false, message: "Listing doest not exist" };
  }

  const marketMaking = await MarketMaking.findOne({
    where: { listingId: data.listingId },
  });

  if (marketMaking) {
    if (marketMaking?.toJSON().jobEnabled) {
      return { status: false, message: "JOB Already Placed" };
    } else {
      const response = await jobQueue.addJobToQueue(data);

      await MarketMaking.update(
        {
          listingId: data.listingId,
          name: listing.name,
          volumePerOrder: data.quantityPerOrder,
          orderline: data.orderline,
          spread: data.spread,
          interval: data.interval,
          jobEnabled: true,
          repeatJobKey: response.repeatJobKey,
        },
        {
          where: { listingId: data.listingId },
        }
      );
      return { status: true, message: "JOB Re-Queued" };
    }
  } else {
    const response = await jobQueue.addJobToQueue(data);

    await MarketMaking.create({
      listingId: data.listingId,
      name: listing.name,
      volumePerOrder: data.quantityPerOrder,
      orderline: data.orderline,
      spread: data.spread,
      interval: data.interval,
      repeatJobKey: response!.repeatJobKey,
    });
    console.log("Job Created and queued");

    return { status: true, message: response };
  }
};

export const disableJob = async (listingId: string) => {
  const job = await MarketMaking.findOne({
    where: { listingId: listingId },
  });

  if (job) {
    if (job.repeatJobKey) {
      const response = await jobQueue.removeJobFromQueue(
        job.repeatJobKey
      );

      if (response) {
        await MarketMaking.update(
          { jobEnabled: false },
          {
            where: { listingId: listingId },
          }
        );

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
  const dBJob = await MarketMaking.findOne({
    where: {
      listingId: listingId,
    },
    include: { model: ListingModel, as: "listing" },
  });
  return { status: true, message: "Success", data: dBJob };
};
