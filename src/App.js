import "./App.css";
import Scorecard from "./components/Scorecard/Scorecard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Scorecard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
