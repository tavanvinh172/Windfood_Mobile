/**
 * Data Model Interfaces
 */

import { Like } from "typeorm";
import { Provider } from "../entities/provider.entity";
import { meiliSearchClient, myDataSource } from "../instances/data-source";

/**
 * In-Memory Store
 */

const providerRepository = myDataSource.getRepository(Provider);
let providerIndex = meiliSearchClient.index('provider');

/**
 * Service Methods
 */

export const findAll = async (): Promise<Provider[]> =>
  providerRepository.find();

export const findById = async (id: number): Promise<Provider | null> =>
  providerRepository.findOne({ where: { providerId: id } });

export const saveOrUpdate = async (newItem: Provider): Promise<Provider> => {
  return providerRepository.save(newItem);
};

export const remove = async (id: number): Promise<boolean> => {
  try {
    providerRepository.delete(id);
    return true;
  } catch (e) {
    return false;
  }
};

export const paging = async (pageIndex: number, pageSize: number, keyword: string) => {
  try {
    if (keyword != undefined) {
      const search = await providerIndex.search(keyword, { page: pageIndex, hitsPerPage: pageSize });
      return { data: await Promise.all(search.hits.map(async (e) => (await findById(e.id)))), count: search.totalHits, hasNext: pageIndex * pageSize < search.totalHits };
    }
    const [result, total] = await providerRepository.findAndCount({
      where: keyword != undefined ? { providerName: Like('%' + keyword + '%') } : {},
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