//    Imports
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import * as helpers from "./helpers";

//    Configuration
dotenv.config();
const app = express();
const port = helpers.readEnvVar("PORT", 3000);
const openai = new OpenAI({
  apiKey: helpers.readEnvVar("OPENAI_KEY", ""),
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
