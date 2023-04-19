import { Request, Response } from "express";
import * as OfferService from "../services/OfferService";

export const getAllOffers = async (req: Request, res: Response) => {
  try {
    const { status, message, data } = await OfferService.getAllOffers();
    return res.status(201).json({ status, message, data });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOffersByOrderId = async (req: Request, res: Response) => {
  const { order_id } = req.params;

  try {
    const { status, message, data } = await OfferService.getOffersByOrderId(
      order_id
    );
    return res.status(201).json({ status, message, data });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
};
