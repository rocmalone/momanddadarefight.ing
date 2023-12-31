import { useState } from "react";
import "./App.css";
import { msg } from "./types";
import Chat from "./components/Chat";
import AngerBar from "./components/AngerBar";

function App() {
  const testMessage: msg = {
    content: "hello test",
  };
  const [dadMsg, setDadMsg] = useState<msg[]>([testMessage]);
  const [momMsg, setMomMsg] = useState<msg[]>([testMessage]);
  const [dadAnger, setDadAnger] = useState(0);
  const [momAnger, setMomAnger] = useState(0);

  const maxAnger = 500;

  const handleTestClick = () => {
    const newMomAnger = momAnger + 30;
    setMomAnger(newMomAnger);
  };

  return (
    <>
      <div className="half left-half">
        <AngerBar maxAnger={maxAnger} anger={momAnger} title="Mom" />
        <Chat messages={momMsg} />
      </div>
      <div className="half right-half">
        <Chat messages={dadMsg} />
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
