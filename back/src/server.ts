//    Imports

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
// @ts-ignore  :  cors does not contain typing
import cors from "cors";
import * as helpers from "./helpers";
import { postBody, openAiRequestMessage, postData, msgOwner } from "./types";

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

//    Functions
async function getAiResponse(postBody: postBody) {
  const previousOpenAiMessages: openAiRequestMessage[] =
    postBody.openAiMessages;
  console.log(previousOpenAiMessages);
  const testOpenAiMsg: openAiRequestMessage = {
    role: "system",
    content: "tell me about bananas in 20 words or less",
  };

  const openAiResponse = await openai.chat.completions.create({
    //@ts-ignore
    messages: previousOpenAiMessages,
    model: "gpt-3.5-turbo",
  });

  const openAiResponseText = openAiResponse.choices[0].message.content;
  return openAiResponseText;
}

//    Routes

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.post("/api/Mom", async (req: Request, res: Response) => {
  const postBody: postBody = req.body;
  const openAiResponseText = await getAiResponse(postBody);
  const responseData: postData = {
    newOpenAiMsg: openAiResponseText,
    responseFrom: msgOwner.Mom,
  };
  res.status(200).send(responseData);
});

app.post("/api/Dad", async (req: Request, res: Response) => {
  const postBody: postBody = req.body;
  const openAiResponseText = await getAiResponse(postBody);
  const responseData: postData = {
    newOpenAiMsg: openAiResponseText,
    responseFrom: msgOwner.Dad,
  };
  res.status(200).send(responseData);
});

app.listen(PORT, () => {
  helpers.log(`Server is running on port ${PORT}`);
});
