import { Queue, Job as BullJob } from "bullmq";
import milliseconds from "milliseconds";
import * as ListingService from "../services/ListingService";
import { connectQueue, queueWorker } from "../config/bull.config";
import Queues from "../common/Queues";
import { fetchListings } from "../services/ArtsplitCoreService";

export class FetchListing {
  private queue: Queue;

  constructor() {
    // initialize queue
    this.queue = connectQueue(Queues.REQUEST_LISTING_ORDERS);

    queueWorker(Queues.REQUEST_LISTING_ORDERS, this.runGetListingJob);

    this.queue.on("error", (error) => {
      console.log(error, "error");
    });
  }

  async addGetListingToQueue(data: { message: string }) {
    console.log("adding to queue....");

    const queueJob = await this.queue.add(`create_get_listing`, data, {
      removeOnComplete: true,
      attempts: 5, // If job fails it will retry till 5 times
      backoff: 5000, // static 5 sec delay between retry
      repeat: {
        every: milliseconds.minutes(
          parseInt(`${process.env.GET_LISTING_INTERVAL}`)
        ),
      },
    });

    return queueJob.toJSON();
  }

  async runGetListingJob(job: BullJob) {
    try {
      console.info(`running get listing job! with id ${job.id}`);

      //GET LISTINGS
      const availableListings = await fetchListings();

      await ListingService.disableUnavailableListings(availableListings);

      //Update Listings Table with New Listings
      await ListingService.updateListings(availableListings);
    } catch (error) {
      console.log(
        error,
        "error-executing-get-listing-job",
        job!.token,
        job!.id
      );
      await job.moveToFailed(new Error(`${error}`), job!.id || "", true);
    }
  }
}
