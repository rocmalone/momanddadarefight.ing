import { useState } from "react";
import "./App.css";
import { msg } from "./types";
import Chat from "./components/Chat";

function App() {
  const testMessage: msg = {
    content: "hello test",
  };
  const [dadMsg, setDadMsg] = useState<msg[]>([testMessage]);
  const [momMsg, setMomMsg] = useState<msg[]>([testMessage]);

  return (
    <>
      <div className="half left-half">
        <Chat messages={momMsg} />
      </div>
      <div className="half right-half">
        <Chat messages={dadMsg} />
      </div>
      <div className="user">test text</div>
    </>
  );
}

export default App;
