require("dotenv").config();
import express from "express";
import { Request, Response } from "express";
import lisingsRoutes from "./routes/listing.routes";
import ordersRoutes from "./routes/order.routes";
import offersRoutes from "./routes/offer.routes";
import marketTakingRoutes from "./routes/market-taking.routes";
import marketMakingRoutes from "./routes/market-making.routes";
import { FetchListing } from "./queues/ListingQueueing";


const FetchListingQueue = new FetchListing();

const cors = require("cors");
const app = express();

// Create route prefixes
const prefix = "/api/v1/";

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(`${prefix}listings`, lisingsRoutes);
app.use(`${prefix}market-making`, marketMakingRoutes);
app.use(`${prefix}market-taking`, marketTakingRoutes);
app.use(`${prefix}orders`, ordersRoutes);
app.use(`${prefix}offers`, offersRoutes);

const isTest = process.env.NODE_ENV === "test";

// const database = require("./models/index.ts");
const database = require("./config/sequelize");




database.sequelize 
  .sync({ alter: false, force: false }) // Set alter to true and force to true to clear batabase and rereun the models on the applications
  .then(() => {
    console.log("Synced db."); 
  })
  .catch((err: any) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get("/", async (req: Request, res: Response) => {
  try {
    res.json({ message: "Welcome to trade bot application." });
  } catch (error) {
    res.json({ message: error });
  }
});

// Run Get-Assets Listing
const getBotListing = async () => {
  try {
    const { name } = await FetchListingQueue.addGetListingToQueue({
      message: `get listings`,
    });

    console.log(`${name} producer running`);
  } catch (error) {
    console.log;
  }
};

// Prevent Running on Test environment
!isTest && getBotListing();

// set port, listen for requests
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export { app, server };
