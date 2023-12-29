import { msg } from "../types";
import React from "react";

type ChatProps = {
  messages: msg[];
};

const Chat = (props: ChatProps) => {
  return (
    <div>
      {props.messages.map((msg, index) => {
        return (
          <div>
            {msg.content}
            {index}
          </div>
        );
      })}
    </div>
  );
};

export default Chat;
