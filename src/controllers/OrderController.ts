import { Request, Response } from "express";
import * as OrderService from "../services/OrderService";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, message, data } = await OrderService.getAllOrders();
    return res.status(201).json({ status, message, data });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOrdersById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, message, data } = await OrderService.getById(id);

    return res.status(201).json({ status, message, data });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
};
