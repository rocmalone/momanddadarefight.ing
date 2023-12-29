//    Imports

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
// @ts-ignore  :  cors does not contain typing
import cors from "cors";
import * as helpers from "./helpers";

//    Configuration

dotenv.config();
const app = express();
app.use(cors()); // CORS headers
app.use(express.json()); // Parse JSON in body

const PORT = helpers.readEnvVar("PORT", 3000);
const HOSTNAME = helpers.readEnvVar("HOSTNAME", "0.0.0.0");

const openai = new OpenAI({
  apiKey: helpers.readEnvVar("OPENAI_KEY", ""),
});

//    Routes

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on port ${PORT}`);
});
