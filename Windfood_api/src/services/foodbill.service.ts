/**
 * Data Model Interfaces
 */

import { FoodBill } from "../entities/foodbill.entity";
import { myDataSource } from "../instances/data-source";

/**
 * In-Memory Store
 */

const foodBillRepository = myDataSource.getRepository(FoodBill);

/**
 * Service Methods
 */

export const findAll = async (): Promise<FoodBill[]> =>
  foodBillRepository.find();

export const findById = async (id: number): Promise<FoodBill | null> =>
  foodBillRepository.findOne({ where: { foodBillId: id } });

export const saveOrUpdate = async (newItem: FoodBill): Promise<FoodBill> => {
  return foodBillRepository.save(newItem);
};

export const remove = async (id: number): Promise<boolean> => {
  try {
    foodBillRepository.delete(id);
    return true;
  } catch (e) {
    return false;
  }
};
