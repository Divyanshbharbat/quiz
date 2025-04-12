import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Landing from "./landing";
// import Login from "./Login";
// import Home from "./Home";
// import Navbar from "./Navbar";
import Landing from "./Components/landing";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Navbar from "./Navbar";
import Signup from "./Components/Signup";
import History from "./Components/history";
import Admin from "./Components/Admin.jsx";
import Adminlogin from "./Components/Adminlogin";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Landing />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminlogin" element={<Adminlogin />} />
      </Routes>
    </Router>
  );
}
