/**
 * Data Model Interfaces
 */

import { Bill } from "../entities/bill.entity";
import { Food } from "../entities/food.entity";
import { myDataSource } from "../instances/data-source";

/**
 * In-Memory Store
 */

const billRepository = myDataSource.getRepository(Bill);
const foodRepository = myDataSource.getRepository(Food);

/**
 * Service Methods
 */

export const findAll = async (): Promise<Bill[]> => billRepository.find();

export const findById = async (id: number): Promise<Bill | null> =>
  billRepository.findOne({ where: { billId: id } });

export const saveOrUpdate = async (newItem: Bill): Promise<Bill> => {
  if (newItem.foodBills != undefined && newItem.foodBills.length > 0) {
    newItem.foodBills.forEach(async e => {
      let food = await foodRepository.findOne({ where: { foodId: e.food?.foodId } });
      if (food && food.quantity && e.quantity) {
        food.quantity -= e.quantity;
        foodRepository.save(food);
      }
      e.createDate = newItem.createDate;
    });
  }
  return billRepository.save(newItem);
};

export const remove = async (id: number): Promise<boolean> => {
  try {
    billRepository.delete(id);
    return true;
  } catch (e) {
    return false;
  }
};

export const paging = async (pageIndex: number, pageSize: number) => {
  try {
    const [result, total] = await billRepository.findAndCount({
      // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
      take: pageSize,
      skip: (pageIndex - 1) * pageSize,
      order: {
        createDate: "DESC"
      }
    });

    return { data: result, count: total };
  } catch (e) {
    return null;
  }
};

export const getDashboard = async (fromDate: string | null, toDate: string | null): Promise<object[]> => {
  let dateCondition = "";

  if (fromDate && toDate) {
    dateCondition = `WHERE (DATE(fb.create_date) BETWEEN DATE('${fromDate}') AND DATE('${toDate}')) `;
  } else if (fromDate) {
    dateCondition = `WHERE (DATE(fb.create_date) > DATE('${fromDate}')) `;
  } else if (toDate) {
    dateCondition = `WHERE (DATE(fb.create_date) < DATE('${toDate}')) `;
  }

  let queryString: string =
    `SELECT tmp.thang as month, SUM(tmp.doanhThu) AS revenue, SUM(loiNhuan) AS profit FROM
    (
      SELECT fb.bill_id , EXTRACT(MONTH FROM MAX(fb.create_date)) AS thang, SUM(price * fb.quantity) AS doanhThu, SUM((price - import_price) * fb.quantity) AS loiNhuan
      FROM food_bill fb
      JOIN food f ON f.food_id = fb.food_id ${dateCondition}
      group BY fb.bill_id
    ) AS tmp GROUP BY tmp.thang ORDER BY tmp.thang`;
  let rs = await myDataSource.manager.query(queryString);
  return rs;
}
