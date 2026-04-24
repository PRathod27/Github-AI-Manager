import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthSuccess from "./components/AuthSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;