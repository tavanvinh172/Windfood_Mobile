/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { initialDatabase } from "./instances/data-source";
import * as Router from "./routers/app-router";

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */
initialDatabase();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(Router.PATH, Router.router);
// initialMeiliSearch();
/**
 * Server Activation
 */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
