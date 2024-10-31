import Calendar from "./components/Calendar";
import "./index.css";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <Calendar />
    </div>
  );
}

export default App;
