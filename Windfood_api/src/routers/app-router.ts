import * as BillRoute from "./bill.router";
import * as CategoryRoute from "./category.router";
import * as FoodRoute from "./food.router";
import * as FoodBillRoute from "./foodbill.router";
import * as PersonRoute from "./person.router";
import * as ProviderRoute from "./provider.router";
import express, { Request, Response } from "express";

export const router = express.Router();
export const PATH = "/api";

router.use(BillRoute.PATH, BillRoute.itemsRouter);
router.use(CategoryRoute.PATH, CategoryRoute.itemsRouter);
router.use(FoodRoute.PATH, FoodRoute.itemsRouter);
router.use(FoodBillRoute.PATH, FoodBillRoute.itemsRouter);
router.use(PersonRoute.PATH, PersonRoute.itemsRouter);
router.use(ProviderRoute.PATH, ProviderRoute.itemsRouter);

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send("WELCOME");
});
