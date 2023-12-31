import { msg } from "../types";
import React from "react";

type ChatProps = {
  messages: msg[];
};

const Chat = (props: ChatProps) => {
  return (
    <div className="chat">
      {props.messages.map((msg, index) => {
        return (
          <div key={index}>
            {msg.content}
            {index}
          </div>
        );
      })}
    </div>
  );
};

export default Chat;
