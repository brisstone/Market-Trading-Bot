import Joi from "joi";
import { Request, Response } from "express";
import { IJobQueue, IListingId } from "../utils/types/types";
import { Listing } from "../models/listings.model";

import * as MarketMakingService from "../services/MarketMakingService";
import { MarketMaking } from "../models/marketmaking.model";

export const CreateJob = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      listingId: Joi.string().required(),
      quantityPerOrder: Joi.number(),
      orderline: Joi.number(),
      spread: Joi.number(),
      interval: Joi.number(),
      jobEnabled: Joi.boolean(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.spread > 3) {
      return res.status(400).send({ message: "SPREAD SHOULD'T EXCEED 3" });
    }

    const payload: IJobQueue = req.body;

    let { status, message } = await MarketMakingService.createJob(payload);

    return res.status(201).json({ status, message });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const DisableJob = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({      
      listingId: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const payload: IListingId = req.body;

    let { status, message } = await MarketMakingService.disableJob(payload.listingId);

    return res.status(201).json({ status, message });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//TODO: function definition is same for both market making & market taking
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const botjobs = await MarketMaking.findAll({
      include: { model: Listing, as: "listing" },
    });
    return res.status(201).json({ botjobs, message: "botjobs retrieved" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//TODO: function definition is same for both market making & market taking
export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const botjobs = await MarketMaking.findOne({
      where: { listingId: id },
      include: { model: Listing, as: "listing" },
    });

    return res.status(201).json({ botjobs, message: "job retrieved" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
