/**
 * Data Model Interfaces
 */

import { Like } from "typeorm";
import { Category } from "../entities/category.entity";
import { meiliSearchClient, myDataSource } from "../instances/data-source";

/**
 * In-Memory Store
 */

const categoryRepository = myDataSource.getRepository(Category);
let categoryIndex = meiliSearchClient.index('category');

/**
 * Service Methods
 */

export const findAll = async (): Promise<Category[]> =>
  categoryRepository.find();

export const findById = async (id: number): Promise<Category | null> =>
  categoryRepository.findOne({ where: { categoryId: id } });

export const saveOrUpdate = async (newItem: Category): Promise<Category> => {
  return categoryRepository.save(newItem);
};

export const remove = async (id: number): Promise<boolean> => {
  try {
    categoryRepository.delete(id);
    return true;
  } catch (e) {
    return false;
  }
};

export const paging = async (pageIndex: number, pageSize: number, keyword: string) => {
  try {
    if (keyword != undefined) {
      const search = await categoryIndex.search(keyword, { page: pageIndex, hitsPerPage: pageSize });
      return { data: await Promise.all(search.hits.map(async (e) => (await findById(e.id)))), count: search.totalHits, hasNext: pageIndex * pageSize < search.totalHits };
    }
    const [result, total] = await categoryRepository.findAndCount({
      where: keyword != undefined ? { categoryName: Like('%' + keyword + '%') } : {},
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
