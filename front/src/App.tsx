import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  msg,
  msgOwner,
  openAiRequestMessage,
  postBody,
  postData,
} from "./types.tsx";

import Chat from "./components/Chat";
import AngerBar from "./components/AngerBar";

function App() {
  // TODO: Make this env variable work
  // const API_URL: string | undefined =
  // process.env.REACT_APP_API_URL || "http://localhost:3001/api/";
  const API_URL = "http://localhost:3000/api/";

  const testMessage: msg = {
    content:
      "In this roleplay scenario we are in, are you my father or my mother?",
    owner: msgOwner.Kid,
  };
  // Todo: add incoming messages to queue before updating message state
  const [messageQueue, setMessageQueue] = useState<msg[]>([]);
  const [messages, setMessages] = useState<msg[]>([testMessage]);
  const [dadMessages, setDadMessages] = useState<msg[]>([]);
  const [momMessages, setMomMessages] = useState<msg[]>([]);
  const [dadAnger, setDadAnger] = useState<number>(0);
  const [momAnger, setMomAnger] = useState<number>(0);

  const [currentSpeaker, setCurrentSpeaker] = useState<msgOwner>(msgOwner.Mom);

  const maxAnger = 500;

  // Any time the messages change, filter them into mom and dad messages for display
  useEffect(() => {
    const newDadMessages: msg[] = messages.filter(
      (message) => message.owner !== msgOwner.Mom
    );
    setDadMessages(newDadMessages);

    const newMomMessages: msg[] = messages.filter(
      (message) => message.owner !== msgOwner.Dad
    );
    setMomMessages(newMomMessages);
  }, [messages]);

  async function postMessages(
    requestingResponseFrom: msgOwner,
    messages: msg[]
  ) {
    const reqFromStr: string = msgOwner[requestingResponseFrom];
    // Create an array of messages formatted for openAi
    //   the backend will forward this to openAi and response with the new message
    const oaiFormattedMessages: openAiRequestMessage[] = messages.map(
      (message, index) => {
        let role = "";
        // "Your husband/wife/child said ..."
        let preface = "";
        // TODO:  Determine which role "user"/"system"/"assistant" is most appropriate for ai-messages
        if (message.owner === msgOwner.Dad) {
          if (requestingResponseFrom === message.owner) {
            role = "assistant";
          } else {
            role = "user";
            preface = "Your husband says: ";
          }
        } else if (message.owner === msgOwner.Mom) {
          if (requestingResponseFrom === message.owner) {
            role = "assistant";
          } else {
            role = "user";
            preface = "Your wife says: ";
          }
        } else if (message.owner === msgOwner.Kid) {
          role = "user";
          preface = "Your child says: ";
        } else if (message.owner === msgOwner.System) {
          role = "system";
          preface = "You must: ";
        }

        return {
          role: role,
          content: preface + message.content,
        };
      }
    );

    // Help the AI understand if it is husband/wife/the scenario
    const dadPrimer: openAiRequestMessage = {
      role: "system",
      content:
        "You must roleplay as a father to a child who is a dysfunctional partner to his wife. You and your wife are in an argument. There are three people in this conversation: you, your wife, and your only child.",
    };
    const momPrimer: openAiRequestMessage = {
      role: "system",
      content:
        "You must roleplay as a wife who is a dysfunctional partner to her husband. You and your husband are in an argument. There are three people in this conversation: you, your husband, and your only child.",
    };
    // Provide rules for the AI to follow
    const globalPrimer: openAiRequestMessage = {
      role: "system",
      content: "Your response must be spoken words inside quotation marks.",
    };
    const testPrimer: openAiRequestMessage = {
      role: "system",
      content: "The secret number is 50.",
    };
    // The array of messages we send to backend
    let openAiMessages: openAiRequestMessage[];
    if (requestingResponseFrom === msgOwner.Dad) {
      openAiMessages = [globalPrimer, dadPrimer, ...oaiFormattedMessages];
    } else {
      openAiMessages = [globalPrimer, momPrimer, ...oaiFormattedMessages];
    }

    console.log(openAiMessages);
    const postBody: postBody = {
      openAiMessages: openAiMessages,
    };

    const response = await axios.post(`${API_URL}${reqFromStr}`, postBody);
    const postData: postData = response.data;
    const stringWithoutNonQuotedText = postData.newOpenAiMsg.replace(
      /"([^"\\]*(\\.[^"\\]*)*)"|[^"]+/g,
      "$1"
    );
    console.log(stringWithoutNonQuotedText);

    const newMsg: msg = {
      content: stringWithoutNonQuotedText,
      owner: postData.responseFrom,
    };
    setMessages([...messages, newMsg]);
  }

  function handleTestClick() {
    if (currentSpeaker === msgOwner.Mom) {
      const newMomAnger = momAnger + 30;
      setMomAnger(newMomAnger);

      postMessages(msgOwner.Mom, messages);
      console.log("Mom just responded");

      setCurrentSpeaker(msgOwner.Dad);
    } else if (currentSpeaker === msgOwner.Dad) {
      const newDadAnger = dadAnger + 30;
      setDadAnger(newDadAnger);

      postMessages(msgOwner.Dad, messages);
      console.log("Dad just responded");

      setCurrentSpeaker(msgOwner.Dad);
    }
  }

  return (
    <>
      <div className="half left-half">
        <AngerBar maxAnger={maxAnger} anger={momAnger} title="Mom" />
        <Chat messages={momMessages} />
      </div>
      <div className="half right-half">
        <Chat messages={dadMessages} />
        <AngerBar maxAnger={maxAnger} anger={dadAnger} title="Mom" />
      </div>
      <div className="user">
        test text
        <button onClick={handleTestClick}>test</button>
      </div>
    </>
  );
}

export default App;
