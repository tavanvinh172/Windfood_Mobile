/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as BillService from "../services/bill.service";
import { Bill } from "../entities/bill.entity";

/**
 * Router Definition
 */

export const itemsRouter = express.Router();
export const PATH = "/bills";
const verifyToken = require('./../middlewares/verify-token');

/**
 * Controller Definitions
 */

// GET items

itemsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const items: Bill[] = await BillService.findAll();

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});


// PAGING items
itemsRouter.post("/paging", verifyToken, async (req: Request, res: Response) => {
  try {
    let [pageIndex, pageSize]: number[] = Object.values(req.body);
    let result = await BillService.paging(pageIndex, pageSize);
    return res.status(200).send(result);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// POST items

itemsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const item: Bill = req.body;
    item.createDate = new Date();
    const newItem = await BillService.saveOrUpdate(item);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

itemsRouter.post("/dashboard", verifyToken, async (req: Request, res: Response) => {
  try {
    const fromDate = req.body.fromDate ? new Date(req.body.fromDate).toISOString().split("T")[0] : null;
    const toDate = req.body.toDate ? new Date(req.body.toDate).toISOString().split("T")[0] : null;

    const items: object[] = await BillService.getDashboard(fromDate, toDate);
    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// DELETE items/:id

itemsRouter.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await BillService.remove(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// GET items/:id

itemsRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item: Bill | null = await BillService.findById(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send("item not found");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});
