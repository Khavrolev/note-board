import Board from "./components/board/board";
import { socket, SocketContext } from "./contexts/SocketProvider";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";

function App() {
  const [userName, setUserName] = useLocalStorage("username");

  return (
    <SocketContext.Provider value={socket}>
      <div className="container">
        <div className="title">
          {userName
            ? `Hello, ${userName}! We're happy to see you`
            : `Hello, friend! Please, sign in`}
        </div>
        <Board />
      </div>
    </SocketContext.Provider>
  );
}

export default App;
