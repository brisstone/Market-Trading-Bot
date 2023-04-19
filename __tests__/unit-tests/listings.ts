import request from "supertest";
import { expect, jest, test } from "@jest/globals";
import {app, server} from "../../src";
import { Listing } from "../../src/models/listings.model";
import { Order } from "../../src/models/orders.model";
import { Offer } from "../../src/models/offers.model";
import { MarketMaking } from "../../src/models/marketmaking.model";

interface IJobQueue {
  listingId: string;
  name: string;
  spread: number;
  volumePerOrder: number;
  orderline: number;
  interval: number;
  jobEnabled: boolean
}

describe("Job-Queuing", () => {
  
  const Orderdata: IJobQueue = {
    listingId: "22",
    name: "Rennaisance",
    volumePerOrder: 55,
    orderline: 10,
    spread: 0.6,
    interval: 10000,
    jobEnabled: true
  };

  const ListingData = {
    listingId: "2232202md2xo22",
    name: "Rennaisance",
    artistName: "Joah Aliem",
    price: 55,
  };


  beforeEach(async () => {
    // code to run before each test
    try {
      await MarketMaking.destroy({ where: {}, truncate: true }).then(async () => {
        await Listing.truncate({ cascade: true });
        await Order.truncate({ cascade: true });
        await Offer.truncate({ cascade: true });
      });
      await Listing.create(ListingData);
    } catch (error) {
      console.error(error, "db clearing --error");
    }
  });

  afterEach(async ()=>{
    server.close()
  })


  it("should return 201 && All Listings", (done) => {
    request(app)
      .get(`/api/v1/listings`)
      .expect("Content-Type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);

        res.body.botListings.forEach((botlisting: any) => {
          expect(botlisting).toMatchSnapshot({
            name: expect.any(String),
            listingId: expect.any(String),
            id: expect.any(Number),
            createdAt: expect.any(String),
          });
        });
        expect(res.body.message).toBe("listings retrieved");
        done();
      });
  });

  it("should return 201 && Job Queued response", (done) => {
    request(app)
      .post(`/api/v1/job`)
      .send(Orderdata)
      .expect("Content-Type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);     
        expect(res.body).toMatchObject({
          message: "Job Created and Queued",
        });
        done();
      });
  });
});