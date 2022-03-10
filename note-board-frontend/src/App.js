import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [userName, setUserName] = useLocalStorage("username");

  return (
    <div>
      <div>Hello, {userName}! We're happy to see you!</div>
    </div>
  );
}

export default App;
