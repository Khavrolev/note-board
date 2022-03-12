import Board from "./components/board/board";
import { socket, SocketContext } from "./contexts/SocketProvider";
import useGetUser from "./hooks/useGetUser";
import "./App.css";

function App() {
  const [user, setUser] = useGetUser("username");

  return (
    <SocketContext.Provider value={socket}>
      <div className="container">
        <div className="title">
          {user
            ? `Hello, ${user.name}! We're happy to see you`
            : `Hello, friend! Please, sign in`}
        </div>
        <Board user={user} />
      </div>
    </SocketContext.Provider>
  );
}

export default App;
