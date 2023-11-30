/**
 * Data Model Interfaces
 */

import { Food } from "../entities/food.entity";
import { Provider } from "../entities/provider.entity";
import { myDataSource, meiliSearchClient } from "../instances/data-source";
import { Category } from "../entities/category.entity";
import { FindManyOptions, Like } from "typeorm";

/**
 * In-Memory Store
 */
const foodRepository = myDataSource.getRepository(Food);
const foodIndex = meiliSearchClient.index('food');

/**
 * Service Methods
 */

export const findAll = async (): Promise<Food[]> => foodRepository.find();

export const findById = async (id: number): Promise<Food | null> =>
  foodRepository.findOne({ where: { foodId: id } });

export const findByProvider = async (provider: Provider): Promise<Food[]> =>
  foodRepository.find({ where: { provider: provider } } as FindManyOptions<Food>);

export const findByCategory = async (category: Category): Promise<Food[] | null> =>
  foodRepository.find({ where: { category: category } } as FindManyOptions<Food>);

export const saveOrUpdate = async (newItem: Food): Promise<Food> => {
  return foodRepository.save(newItem);
};

export const remove = async (id: number): Promise<boolean> => {
  try {
    foodRepository.delete(id);
    return true;
  } catch (e) {
    return false;
  }
};

export const paging = async (pageIndex: number, pageSize: number, keyword: string) => {
  try {
    if (keyword != undefined) {
      const search = await foodIndex.search(keyword, { page: pageIndex, hitsPerPage: pageSize });
      return { data: await Promise.all(search.hits.map(async (e) => (await findById(e.id)))), count: search.totalHits, hasNext: pageIndex * pageSize < search.totalHits };
    }
    const [result, total] = await foodRepository.findAndCount({
      where: keyword != undefined ? { foodName: Like('%' + keyword + '%') } : {},
      take: pageSize,
      skip: (pageIndex - 1) * pageSize,
      order: {
        createDate: "DESC"
      }
    });
    return { data: result, count: total, hasNext: pageIndex * pageSize < total };
  } catch (e) {
    return null;
  }
};
