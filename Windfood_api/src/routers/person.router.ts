/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as PersonService from "../services/person.service";
import { Person } from "../entities/person.entity";

/**
 * Router Definition
 */

export const itemsRouter = express.Router();
export const PATH = "/persons";
const verifyToken = require('./../middlewares/verify-token');

/**
 * Controller Definitions
 */

// GET items

itemsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const items: Person[] = await PersonService.findAll();

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

itemsRouter.get("/get-current-user", verifyToken, async (req: Request, res: Response) => {
  try {
    const items: object | null = await PersonService.getCurrentUser(req.headers?.authorization?.split(" ")[1] as string);

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// PAGING items
itemsRouter.post("/paging", verifyToken, async (req: Request, res: Response) => {
  try {
    let [pageIndex, pageSize, search]: never[] = Object.values(req.body);
    let result = await PersonService.paging(pageIndex, pageSize, search);
    return res.status(200).send(result);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// POST items

itemsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const item: Person = req.body;
    item.createDate = new Date();
    const newItem = await PersonService.saveOrUpdate(item);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});


itemsRouter.post("/login", async (req: Request, res: Response) => {
  try {
    let rs: String = await PersonService.login(req.body as Person);
    console.log(rs);
    res.status(200).json(rs);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// DELETE items/:id

itemsRouter.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await PersonService.remove(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// GET items/:id

itemsRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item: Person | null = await PersonService.findById(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send("item not found");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});
