/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as FoodService from "../services/food.service";
import { Food } from "../entities/food.entity";
import { Provider } from "../entities/provider.entity";
import { Category } from "../entities/category.entity";

/**
 * Router Definition
 */

export const itemsRouter = express.Router();
export const PATH = "/foods";
const verifyToken = require('./../middlewares/verify-token');

/**
 * Controller Definitions
 */

// GET items

itemsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const items: Food[] = await FoodService.findAll();

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

itemsRouter.get("/by-provider", verifyToken, async (req: Request, res: Response) => {
  try {
    const items: Food[] | null = await FoodService.findByProvider(req?.body as Provider);

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

itemsRouter.get("/by-category", verifyToken, async (req: Request, res: Response) => {
  try {
    const items: Food[] | null = await FoodService.findByCategory(req?.body as Category);

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});
// PAGING items
itemsRouter.post("/paging", verifyToken, async (req: Request, res: Response) => {
  try {
    let [pageIndex, pageSize, search]: never[] = Object.values(req.body);
    let result = await FoodService.paging(pageIndex, pageSize, search);
    return res.status(200).send(result);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// POST items

itemsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const item: Food = req.body;
    item.createDate = new Date();
    const newItem = await FoodService.saveOrUpdate(item);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// DELETE items/:id

itemsRouter.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await FoodService.remove(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// GET items/:id

itemsRouter.get("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item: Food | null = await FoodService.findById(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send("item not found");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});
