import { Queue, Job as BullJob } from "bullmq";
import { getListingById, placeOrders } from "../services/ArtsplitCoreService";
import { Listing as ListingModel } from "../models/listings.model";
import { Order } from "../models/orders.model";
import { IJobQueue } from "../utils/types/types";
import { calcSellOrders } from "../utils/calcSellOrders";
import { calcBuyOrders } from "../utils/calcBuyOrders";
import milliseconds from "milliseconds";
import * as OfferService from "../services/OfferService";
import * as OrderService from "../services/OrderService";
import { connectQueue, queueWorker } from "../config/bull.config";
import Queues from "../common/Queues";
import { MarketMaking } from "../models/marketmaking.model";

export class JobQueue {
  private queue: Queue;

  constructor() {
    // initialize queue
    this.queue = connectQueue(Queues.MARKET_MAKER_TASKS);

    queueWorker(Queues.MARKET_MAKER_TASKS, this.runJob);

    this.queue.on("error", (error) => {
      console.log(error, "error");
    });
  }

  async addJobToQueue(data: IJobQueue) {
    try {
      console.log("adding to queue....");

      const queueJob = await this.queue.add(
        `ordercreated_${data.listingId}`,
        data,
        {
          removeOnComplete: true,
          attempts: 5, // If job fails it will retry till 5 times
          backoff: 5000, // static 5 sec delay between retry
          repeat: {
            every: milliseconds.minutes(data.interval),
            // determines the number of times each job runs. if not supplied, it runs at infinity
            limit:
              parseInt(`${process.env.JOB_RUNTIME_COUNT_LIMIT}`) || undefined,
          },
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
  async runJob(job: BullJob) {
    console.log("running job......");

    try {
      // Also check if the job is still available to run
      // API Call - fetch InputOrders (Top Buy, Bottom Sell) using listing_id and
      // Save InputOrders on job table
      // updates on the listing table which takes effect when the jobs table is called
      // Create Orders logic using lising id and variables

      const runningJob = job.toJSON().data;

      console.log(job.toJSON(),'isisiis');
      

      const dBJob = await MarketMaking.findOne({
        where: {
          listingId: runningJob.listingId,
        },
        include: { model: ListingModel, as: "listing" },
      });

      // Cancel All Listing Offers Placed
      await OfferService.withdrawOffers(runningJob.listingId);

      //Create Order if Listing is still enabled and job is still enabled by admin
      if (dBJob?.toJSON().jobEnabled && dBJob?.toJSON().listingEnabled) {
        //Api call to get orders for the listing from core app
        const data = await getListingById(job.toJSON().data.listingId);

        const bottomSell: number = data.data.data.bottom_sell.amount;
        let topBuy: number = data.data.data.top_buy.amount;

        //When the topbuy is zero
        if (topBuy == 0) {
          topBuy = parseFloat(`${process.env.BOT_BUY_PRICE_AT_ZERO_TOP_BUY}`);
        }

        const listingdata = {
          bottomSell: bottomSell,
          topBuy: topBuy,
          listingId: job.toJSON().data.listingId,
        };

        const spread = dBJob?.toJSON().spread;
        const orderline = dBJob?.toJSON().orderline;

        if (data) {
          //Update the bottomSell and topBuy in bot database
          await OrderService.updateListingOrder(
            listingdata,
            runningJob.listingId
          );
          const sells = calcSellOrders(
            listingdata.bottomSell,
            spread,
            orderline
          );

          const buys = calcBuyOrders(listingdata.topBuy, spread, orderline);

          //Calculate new orders for bot
          const DbOrder = await Order.create({
            listingId: dBJob?.toJSON().listingId,
            buyOrders: JSON.stringify(buys),
            sellOrders: JSON.stringify(sells),
          }); 

          for (let i = 0; i < buys.length; i++) {
            if (buys[i] != 0) {
              await placeOrders(
                runningJob.listingId,
                dBJob!.toJSON()!.volumePerOrder,
                buys[i],
                DbOrder.toJSON().id,
                "bot/place_buy_offer",
                "MARKET_MAKING",
                "BUY"
              );
            }
          }

          for (let i = 0; i < sells.length; i++) {
            if (sells[i] > listingdata.topBuy) {
              if (sells[i] != 0) {
                await placeOrders(
                  runningJob.listingId,
                  dBJob!.volumePerOrder,
                  sells[i],
                  DbOrder.toJSON().id,
                  "bot/place_sell_offer",
                  "MARKET_MAKING",
                  "SELL"
                );
              }
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
}
