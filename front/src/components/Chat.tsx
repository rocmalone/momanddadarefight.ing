import { msg, msgOwner } from "../types.tsx";

type ChatProps = {
  messages: msg[];
};

const Chat = (props: ChatProps) => {
  return (
    <div className="chat">
      {props.messages.map((msg, index) => {
        // Select class based on sender
        let cssClass = "";
        switch (msg.owner) {
          case msgOwner.Kid:
            cssClass = "kid-message";
            break;
          case msgOwner.Dad:
            cssClass = "dad-message";
            break;
          case msgOwner.Mom:
            cssClass = "mom-message";
            break;
        }
        return (
          <div key={index} className={`message ${cssClass}`}>
            {msg.content}
            {index}
          </div>
        );
      })}
    </div>
  );
};

export default Chat;
