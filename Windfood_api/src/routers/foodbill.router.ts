/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as FoodBillService from "../services/foodbill.service";
import { FoodBill } from "../entities/foodbill.entity";

/**
 * Router Definition
 */

export const itemsRouter = express.Router();
export const PATH = "/foodbills";
const verifyToken = require('./../middlewares/verify-token');

/**
 * Controller Definitions
 */

// GET items

itemsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const items: FoodBill[] = await FoodBillService.findAll();

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// POST items

itemsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const item: FoodBill = req.body;
    item.createDate = new Date();
    const newItem = await FoodBillService.saveOrUpdate(item);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// DELETE items/:id

itemsRouter.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await FoodBillService.remove(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// GET items/:id

itemsRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item: FoodBill | null = await FoodBillService.findById(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send("item not found");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});
