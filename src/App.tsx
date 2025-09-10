import "./App.css";
import Login from "./screens/Login";
import Register from "./screens/Register";
import { BrowserRouter as Router, Navigate,Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
      {/* <Route path="/" element={
      isAuthenticated() 
      ? <Navigate to="/home" replace /> 
      : <Navigate to="/login" replace />
        }/> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/not_found" replace />} />
      </Routes>
    </Router>
  );
}
export default App;