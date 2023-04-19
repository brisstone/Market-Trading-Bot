import { Queue, Job as BullJob } from "bullmq";
import { getTradesInRage, placeOrders } from "../services/ArtsplitCoreService";
import { IJobQueue, OrderTypeI } from "../utils/types/types";
import { calcOrderTriggers } from "../utils/calcOrderTriggers";
import { connectQueue, queueWorker } from "../config/bull.config";
import Queues from "../common/Queues";

import * as MarketTakingService from "../services/MarketTakingService";
import * as ListingService from "../services/ListingService";
import * as OrderService from "../services/OrderService";
import * as OfferService from "../services/OfferService";

export class MTQueue {
  private queue: Queue;

  constructor() {
    // initialize queue for job running
    this.queue = connectQueue(Queues.MARKET_TAKER_TASKS);

    queueWorker(Queues.MARKET_TAKER_TASKS, this.executeTasks);

    this.queue.on("error", (error) => {
      console.log(error, "error");
    });
  }

  async addJobToQueue(data: IJobQueue) {
    try {
      console.log("adding to queue....");

      const queueJob = await this.queue.add(
        `LIMIT_ORDER_V2_${data.listingId}`,
        data,
        {
          removeOnComplete: true,
          attempts: 5, // If job fails it will retry till 5 times
          backoff: 5000, // static 5 sec delay between retry
          repeat: {
            pattern: `${process.env.MARKET_TAKING_INTERVAL}`, //Market Taker
            // determines the number of times each job runs. if not supplied, it runs at infinity
            limit:
              parseInt(`${process.env.JOB_RUNTIME_COUNT_LIMIT}`) || undefined,
          },
          // jobId: data.repeatJobKey,
        }
      );

      return {
        status: true,
        message: "Job Created and Queued",
        repeatJobKey: queueJob.toJSON().repeatJobKey,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: false,
        message: error.message,
      };
    }
  }

  //TODO: this function definition is repeated and should not be
  async removeJobFromQueue(repeatJobKey: string) {
    try {
      console.log(`removing job ${repeatJobKey} from queue....`);

      const response: boolean = await this.queue.removeRepeatableByKey(
        repeatJobKey
      );

      return response;
    } catch (error) {
      return new Error(`${error}`);
    }
  }

  async executeTasks(job: BullJob) {
    try {
      console.log("running jobV2......");

      // Also check if the job is still available to run
      // API Call - fetch InputOrders (Top Buy, Bottom Sell) using listing_id and
      // Save InputOrders on job table
      // updates on the listing table which takes effect when the jobs table is called
      // Create Orders logic using lising id and variables

      const runningJob = job.toJSON().data;

      let { data: dBJob } = await MarketTakingService.findByListingId(
        runningJob.listingId
      );

      let { data: dBListing } = await ListingService.findById(
        runningJob.listingId
      );

      // Cancel All Listing Offers Placed
      await OfferService.withdrawOffers(job.toJSON().data.listingId);

      //Create Order if Listing is still enabled and job is still enabled by admin
      if (dBJob?.jobEnabled && dBJob?.listingEnabled) {
        const price = dBListing?.toJSON().price;
        const triggerSpread = dBJob?.toJSON().triggerSpread;

        const { buyTriggerPrice, sellTriggerPrice } = calcOrderTriggers(
          triggerSpread,
          price
        );

        const data = await getTradesInRage(
          job.toJSON().data.listingId,
          buyTriggerPrice,
          sellTriggerPrice
        );

        console.log(data, "data");

        if (!data) {
          console.log(
            "Trades not found for listing",
            job.toJSON().data.listingId
          );
          return;
        }

        const buys = data.buys;
        const sells = data.sells;

        
        const buyOrders: OrderTypeI[] = [];
        let sellOrders: OrderTypeI[] = [];

        await buys.map((buy: OrderTypeI) => {
          buyOrders.push({
            amount: buy.amount,
            quantity: buy.quantity,
            _id: buy._id,
          });
        });

        await sells.map((sell: OrderTypeI) => {
          sellOrders.push({
            amount: sell.amount,
            quantity: sell.quantity,
            _id: sell._id,
          });
        });

        if (buys.length !== 0 || sells.length !== 0) {
          let { data: DbOrder } = await OrderService.createOrder(
            dBJob?.toJSON().listingId,
            JSON.stringify(sellOrders),
            JSON.stringify(buyOrders),
            buyTriggerPrice,
            sellTriggerPrice
          );

          for (let i = 0; i < buys.length; i++) {
            if (buys[i].amount != 0) {
              await placeOrders(
                runningJob.listingId,
                buys[i].quantity,
                buys[i].amount,
                DbOrder.id,
                "bot/place_buy_offer",
                "MARKET_TAKING",
                "BUY"
              );
            }
          }

          for (let i = 0; i < sells.length; i++) {
            if (sells[i].amount != 0) {
              await placeOrders(
                runningJob.listingId,
                sells[i].quantity,
                sells[i].amount,
                DbOrder.toJSON().id,
                "bot/place_sell_offer",
                "MARKET_TAKING",
                "SELL"
              );
            }
          }

          return "Order Created";
        }
      }
    } catch (error) {
      console.log(error, "error-executing-job", job!.token, job!.id);
      await job.moveToFailed(
        new Error("my error message"),
        job!.id || "",
        false
      );
    }
  }
}
