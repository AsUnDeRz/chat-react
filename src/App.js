import logo from "./logo.svg";
import "./App.css";
import { io } from "socket.io-client";
import React from "react";
import { Chat } from "./chat/Chat";

function App() {
  return <Chat />;

  const [time, setTime] = React.useState("fetching");
  const [notify, setNotify] = React.useState("");

  React.useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("connect", () => console.log(socket.id));
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });
    socket.on("time", (data) => setTime(data));
    socket.on("disconnect", () => setTime("server disconnected"));
    socket.on("receive", (data) => {
      setNotify(data);
      setTimeout(() => setNotify(""), 3000);
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Time.io</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p> {time}</p>
        </a>
        <p> {notify}</p>
      </header>
    </div>
  );
}

export default App;
