import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top shadow-sm" data-aos="fade-down">
      <div className="container">
        <a className="navbar-brand fw-bold text-success fs-3" href="#">QuizMaster</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-2 align-items-center">
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={() => navigate("/login")}>Login</button>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={() => navigate("/signup")}>Sign Up</button>
            </li>
            <li className="nav-item">
              <button className="btn btn-success ms-2" onClick={() => {
                const token = localStorage.getItem("token");
                navigate(token ? "/home" : "/login");
              }}>Start Quiz</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
