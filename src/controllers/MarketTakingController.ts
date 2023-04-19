import Joi from "joi";
import { Request, Response } from "express";
import { IJobQueue } from "../utils/types/types";

import * as MarketTakingService from "../services/MarketTakingService";
import { MarketTaking } from "../models/markettaking.model";
import { Listing } from "../models/listings.model";

//This is the api to create job for the trading bot v2 implemented
export const CreateJob = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      listingId: Joi.string().required(),
      triggerSpread: Joi.number(),
      jobEnabled: Joi.boolean(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const payload: IJobQueue = req.body;

    let { status, message } = await MarketTakingService.createJob(payload);

    return res.status(201).json({ status, message });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const DisableJob = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      listingId: Joi.string().required(),
      volumePerOrder: Joi.number(),
      orderline: Joi.number(),
      trigger_spread: Joi.number(),
      interval: Joi.number(),
      jobEnabled: Joi.boolean().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const payload: IJobQueue = req.body;

    let { status, message } = await MarketTakingService.disableJob(payload);

    return res.status(201).json({ status, message });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};



//TODO: function definition is same for both market making & market taking
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const botjobs = await MarketTaking.findAll({
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
    const botjobs = await MarketTaking.findOne({
      where: { listingId: id },
      include: { model: Listing, as: "listing" },
    });

    return res.status(201).json({ botjobs, message: "job retrieved" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
