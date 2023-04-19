import { Request, Response } from "express";
import * as ListingService from "../services/ListingService";

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const botListings = await ListingService.getListings();
    
    return res.status(201).json({ botListings, message: "listings retrieved" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
};
