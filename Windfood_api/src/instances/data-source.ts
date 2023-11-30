import { DataSource } from "typeorm";
import * as dotEnv from 'dotenv';
import { MeiliSearch, MeiliSearchCommunicationError } from 'meilisearch'
import { Food } from "../entities/food.entity";
import { Person } from "../entities/person.entity";
import { Category } from "../entities/category.entity";
import { Provider } from "../entities/provider.entity";

dotEnv.config();

const URL: string | undefined = process.env?.URL;
const DB_PORT: number = parseInt(process.env.DB_PORT as string, 10);
const DB_NAME: string | undefined = process.env?.DB_NAME;
const DB_USER: string | undefined = process.env?.DB_USER;
const DB_PASSWORD: string | undefined = process.env?.DB_PASSWORD;
const MEILISEARCH_KEY: string | undefined = process.env?.MLS_KEY;

export const meiliSearchClient = new MeiliSearch({ host: `${URL}:7700`, apiKey: MEILISEARCH_KEY });
export const myDataSource = new DataSource({
  type: "mysql",
  host: URL,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ["src/entities/*.ts"],
  logging: false,
  synchronize: true,
});

export function initialDatabase(): void {
  myDataSource
    .initialize()
    .then(async () => {
      console.log("Data source has been initialized!");
      try {
        await myDataSource.query("insert into person(username, hashed_password, name, birthday, role, token) SELECT * FROM (SELECT 'admin','$2a$10$v6x2L6vNv1jP/2r7t55cguorm3Ulafu5lB.mXmR.mE/U1xbZ8/ElW', '', '2000-01-01', 0, NULL) AS tmp WHERE NOT EXISTS (SELECT p.username FROM PERSON p WHERE p.username = 'admin')");
        console.log("Admin account created successfully");
        await initialMeiliSearch();
        console.log("Connected to meilisearch server");
      } catch (e) {
        if (e instanceof MeiliSearchCommunicationError) {
          console.log("Can not connect to meilisearch server");
        } else {
          console.log("Can not create admin account");
        }
      }
    })
    .catch((error) => {
      console.log("Error during data source initialization: ", error);
    });
}

async function initialMeiliSearch(): Promise<void> {
  let foodIndex = meiliSearchClient.index('food');
  let categoryIndex = meiliSearchClient.index('category');
  let personIndex = meiliSearchClient.index('person');
  let providerIndex = meiliSearchClient.index('provider');


  const foodItems = (await myDataSource.getRepository(Food).find()).map((e) => { return { 'id': e.foodId, 'title': e.foodName, } });
  const categoryItems = (await myDataSource.getRepository(Category).find()).map((e) => { return { 'id': e.categoryId, 'title': e.categoryName } });
  const personItems = (await myDataSource.getRepository(Person).find()).map((e) => { return { 'id': e.personId, 'title': e.name } });
  const providerItems = (await myDataSource.getRepository(Provider).find()).map((e) => { return { 'id': e.providerId, 'title': e.providerName } });

  await foodIndex.addDocuments(foodItems);
  await categoryIndex.addDocuments(categoryItems);
  await personIndex.addDocuments(personItems);
  await providerIndex.addDocuments(providerItems);


  // const search = await foodIndex.search('gà', { page: 3, hitsPerPage: 2 });
  // console.log(search);
  // const search1 = await categoryIndex.search('burger');
  // console.log(search1);
  // const search2 = await personIndex.search('Van');
  // console.log(search2);
  // const search3 = await providerIndex.search('CTY');
  // console.log(search3);

}
