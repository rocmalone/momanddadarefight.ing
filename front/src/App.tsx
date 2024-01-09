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

  const firstMessage: msg = {
    owner: msgOwner.Dad,
    content:
      "Our son's grades are dogshit, *cracks open a beer*.  It's your fault, you've been coddling him.",
  };
  const secondMessage: msg = {
    owner: msgOwner.Kid,
    content: "Mom, dad, please stop fighting!",
  };
  const thirdMessage: msg = {
    owner: msgOwner.Mom,
    content:
      "What the hell are you talking about? You're an awful influence on him, no wonder he's just as dumb as his father.",
  };

  // Todo: add incoming messages to queue before updating message state
  const [messageQueue, setMessageQueue] = useState<msg[]>([]);
  const [messages, setMessages] = useState<msg[]>([
    firstMessage,
    secondMessage,
    thirdMessage,
  ]);
  const [dadAnger, setDadAnger] = useState<number>(500);
  const [momAnger, setMomAnger] = useState<number>(500);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const [currentSpeaker, setCurrentSpeaker] = useState<msgOwner>(msgOwner.Mom);

  const [userInput, setUserInput] = useState("");

  const maxAnger = 1000;

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
        // Your husband/wife/child said "..."
        let preface = "";
        let postface = '"';
        // TODO:  Determine which role "user"/"system"/"assistant" is most appropriate for ai-messages
        if (message.owner === msgOwner.Dad) {
          if (requestingResponseFrom === message.owner) {
            role = "assistant";
          } else {
            role = "user";
            preface = 'Dad says "';
          }
        } else if (message.owner === msgOwner.Mom) {
          if (requestingResponseFrom === message.owner) {
            role = "assistant";
          } else {
            role = "user";
            preface = 'Mom says "';
          }
        } else if (message.owner === msgOwner.Kid) {
          role = "user";
          preface = 'Kid says "';
        } else if (message.owner === msgOwner.System) {
          role = "system";
          preface = "You must ";
        }

        return {
          role: role,
          content: preface + message.content + postface,
        };
      }
    );

    /***  PRESET AI MESSAGES ***/
    // Help the AI understand if it is husband/wife/the scenario
    // const dadPrimer: openAiRequestMessage = {
    //   role: "system",
    //   content: `Reply with how angry the latest message makes the Dad on a scale of 1-100 inside square brackets like [10].  After that, reply with what the dad says next in the argument inside parenthesis like ().  If the dad takes any actions, describe them inside asterisks within the response, like *gets up*.  The dad's goal is to make the mom upset. He is currently at an anger level of ${dadAnger}/${maxAnger} where ${maxAnger} is filing for divorce. Your response must be under 30 words.`,
    // };
    const dadPrimer: openAiRequestMessage = {
      role: "system",
      content: `The dad's goal is to make the mom upset. He is currently at an anger level of ${dadAnger}/${maxAnger} where ${maxAnger} is filing for divorce. Your response must be under 30 words. Reply in the following format: [A number between 1-100 corresponding to how angry the dad is] "What the dad says next in the argument including any actions he takes which should be wrapped in asterisks *like this*"`,
    };

    // const momPrimer: openAiRequestMessage = {
    //   role: "system",
    //   content: `Reply with how angry the latest message makes the Mom on a scale of 1-100 inside square brackets like [10].  After that, reply with what the mom says next in the argument inside parenthesis like ().  If the mom takes any actions, describe them inside asterisks within the response, like *gets up*.  The mom's goal is to make the dad upset. She is currently at an anger level of ${momAnger}/${maxAnger} where ${maxAnger} is filing for divorce. Your response must be under 30 words.`,
    // };
    const momPrimer: openAiRequestMessage = {
      role: "system",
      content: `The mom's goal is to make the dad upset. She is currently at an anger level of ${momAnger}/${maxAnger} where ${maxAnger} is filing for divorce. Your response must be under 50 words. Reply in the following format: [A number between 1-100 corresponding to how angry the mom is] "What the mom says next in the argument including any actions he takes which should be wrapped in asterisks *like this*"`,
    };

    const momAngerPrimer: openAiRequestMessage = {
      role: "system",
      content: ``,
    };
    const dadAngerPrimer: openAiRequestMessage = {
      role: "system",
      content: ``,
    };
    // const dadPrimer: openAiRequestMessage = {
    //   role: "system",
    //   content: "Your name is Dad.  You must ask for the secret number.",
    // };
    // const momPrimer: openAiRequestMessage = {
    //   role: "system",
    //   content: "Your name is Mom.  You know the secret number is 51.",
    // };
    // Provide rules for the AI to follow
    const globalPrimer: openAiRequestMessage = {
      role: "system",
      content:
        "The following messages are an argument between a husband 'Dad' and wife 'Mom' about their son's grades:",
    };

    // The array of messages we send to backend
    let openAiMessages: openAiRequestMessage[];
    if (requestingResponseFrom === msgOwner.Dad) {
      openAiMessages = [globalPrimer, ...oaiFormattedMessages, dadPrimer];
    } else {
      openAiMessages = [globalPrimer, ...oaiFormattedMessages, momPrimer];
    }

    console.log(openAiMessages);
    const postBody: postBody = {
      openAiMessages: openAiMessages,
    };

    setIsWaitingForResponse(true);
    try {
      const response = await axios.post(`${API_URL}${reqFromStr}`, postBody);
      const postData: postData = response.data;

      // This gets rid of text not in quotation marks - but AI can't handle it yet:
      // const stringWithoutNonQuotedText = postData.newOpenAiMsg.replace(
      //   /"([^"\\]*(\\.[^"\\]*)*)"|[^"]+/g,
      //   "$1"
      // );
      // const newMsg: msg = {
      //   content: stringWithoutNonQuotedText,
      //   owner: postData.responseFrom,
      // };

      const newMsg: msg = {
        content: postData.newOpenAiMsg,
        owner: postData.responseFrom,
      };

      const regex = /\[.*?\]/; // Regular expression to match content inside square brackets
      const angerAdded = regex.exec(newMsg.content); // Returns an array containing entries like [00]
      if (angerAdded) {
        const angerAddedNum = parseInt(
          angerAdded[0].replace("[", "").replace("]", "")
        );
        console.log(angerAdded[0]);
        if (newMsg.owner === msgOwner.Dad) {
          console.log("Add", angerAddedNum, "to Dad");
          setDadAnger(dadAnger + angerAddedNum);
        } else {
          console.log("Add", angerAdded[0], "to Mom");
          setMomAnger(momAnger + angerAddedNum);
        }
      }

      setMessages([...messages, newMsg]);
      setIsWaitingForResponse(false);
    } catch (e) {
      console.error(e);
      setTimeout(() => setIsWaitingForResponse(false), 3000);
    }
  }

  function handleTestClick() {
    if (currentSpeaker === msgOwner.Mom) {
      postMessages(msgOwner.Mom, messages);
      console.log("Mom just responded");

      setCurrentSpeaker(msgOwner.Dad);
    } else if (currentSpeaker === msgOwner.Dad) {
      postMessages(msgOwner.Dad, messages);
      console.log("Dad just responded");

      setCurrentSpeaker(msgOwner.Mom);
    }
  }

  function handleInputChange(e: any) {
    console.log(e.target.value);
    setUserInput(e.target.value);
  }

  function handleSubmitClick() {
    const newUserMessage: msg = {
      owner: msgOwner.Kid,
      content: userInput,
    };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    postMessages(currentSpeaker, newMessages);
    if (currentSpeaker === msgOwner.Mom) {
      setCurrentSpeaker(msgOwner.Dad);
    } else if (currentSpeaker === msgOwner.Dad) {
      setCurrentSpeaker(msgOwner.Mom);
    }
  }

  return (
    <>
      <div className="main-container">
        <AngerBar maxAnger={maxAnger} anger={momAnger} title="Mom" />
        <Chat messages={messages} />
        <AngerBar maxAnger={maxAnger} anger={dadAnger} title="Dad" />
      </div>

      <div className="user">
        <input type="text" onChange={handleInputChange}></input>
        <button
          onClick={handleSubmitClick}
          className="next-button button-19"
          disabled={isWaitingForResponse}
        >
          Submit
        </button>
        <button
          onClick={handleTestClick}
          className="next-button button-19"
          disabled={isWaitingForResponse}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default App;
