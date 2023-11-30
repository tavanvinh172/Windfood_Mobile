/**
 * Data Model Interfaces
 */

import { FindOptionsWhere, Like } from "typeorm";
import { Person } from "../entities/person.entity";
import { meiliSearchClient, myDataSource } from "../instances/data-source";

/**
 * In-Memory Store
 */

const personRepository = myDataSource.getRepository(Person);
let personIndex = meiliSearchClient.index('person');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Service Methods
 */

export const findAll = async (): Promise<Person[]> => personRepository.find();

export const findById = async (id: number): Promise<Person | null> =>
  personRepository.findOne({ where: { personId: id } });

export const getCurrentUser = async (token: string): Promise<object | null> => {
  let [user] = await myDataSource.manager.query(`SELECT * FROM person p where p.token = '${token}'`);
  // let [{ total }] = await myDataSource.manager.query(`SELECT COUNT(*) as total FROM person;`);
  // console.log(user);
  // console.log(total);
  delete user["token"]
  delete user["username"]
  delete user["password"]
  return user;
}

export const saveOrUpdate = async (newItem: Person): Promise<Person> => {
  // newItem.hashedPassword = btoa(newItem.hashedPassword as string);
  if (newItem.personId && !newItem.password) {
    newItem.password = (await findById(newItem.personId))?.password;
  } else {
    newItem.password = await hashedPassword(newItem.password as string);
  }
  // console.log(atob(newItem.hashedPassword as string));
  return personRepository.save(newItem);
};

export const remove = async (id: number): Promise<boolean> => {
  try {
    personRepository.delete(id);
    return true;
  } catch (e) {
    return false;
  }
};

export const login = async (person: Person): Promise<String> => {
  try {
    let user: Person | null = await personRepository.findOneBy({ username: person.username } as FindOptionsWhere<Person>);
    if (!user) return "";

    const checkPassword = await bcrypt.compare(person.password, user.password);
    user.token = await generateToken(user.personId)
    await personRepository.save(user)

    if (checkPassword) {
      return user.token
    }
    return "";
  } catch (e) {
    console.log(e);

    return "";
  }
};

const hashedPassword = async (password: String): Promise<string> => {
  return await bcrypt.hash(password, await bcrypt.genSalt(10));
};

const generateToken = async (id: number): Promise<string> => {
  const token = jwt.sign({ _id: id }, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 });
  return token;
};

export const paging = async (pageIndex: number, pageSize: number, keyword: string) => {
  try {
    if (keyword != undefined) {
      const search = await personIndex.search(keyword, { page: pageIndex, hitsPerPage: pageSize });
      return { data: await Promise.all(search.hits.map(async (e) => (await findById(e.id)))), count: search.totalHits, hasNext: pageIndex * pageSize < search.totalHits };
    }
    const [result, total] = await personRepository.findAndCount({
      where: keyword != undefined ? { name: Like('%' + keyword + '%') } : {},
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
