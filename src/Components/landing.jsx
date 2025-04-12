import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Plotly from "plotly.js-dist-min";
import AOS from "aos";
import "aos/dist/aos.css";
import './landing.css';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Plotly chart setup
    Plotly.newPlot('progressChart', [{
      type: 'bar',
      x: ['Math', 'Science', 'History', 'Coding'],
      y: [85, 75, 90, 70],
      marker: {
        color: ['#28a745', '#17a2b8', '#ffc107', '#6610f2']
      }
    }], {
      title: 'Your Progress Overview',
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#fff' }
    });
  }, []);

  const handleStart = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/home" : "/login");
  };

  return (
    <div className="landing font-poppins bg-dark text-white">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center min-vh-100" data-aos="fade-up">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold mb-3">Welcome to <span className="text-success">QuizMaster</span></h1>
              <p className="lead mb-4">Explore knowledge with quizzes crafted to challenge and elevate your mind.</p>
              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-success btn-lg shadow-sm animated-btn" onClick={handleStart}>🚀 Start Quiz</button>
                <button className="btn btn-outline-light" onClick={() => navigate("/login")}>Login</button>
                <button className="btn btn-outline-light" onClick={() => navigate("/signup")}>Sign Up</button>
                <button className="btn btn-outline-primary" onClick={() => navigate("/adminlogin")}>Admin Login</button>
              </div>
            </div>
            <div className="col-md-5 text-center mt-5 mt-md-0">
              <img src="https://img.freepik.com/free-vector/did-you-know-marketing-background-social-interesting-fact_1017-49301.jpg?ga=GA1.1.109368830.1743779497&semt=ais_hybrid&w=740" alt="Quiz Brain" className="img-fluid glass-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section text-center py-5" data-aos="fade-up">
        <div className="container">
          <h2 className="fw-bold mb-4 text-white">Why Choose QuizMaster?</h2>
          <div className="row g-4">
            {[
              { icon: '🧠', title: 'Smart Learning', desc: 'Boost your logic with curated quizzes.' },
              { icon: '⚡', title: 'Instant Results', desc: 'Get feedback instantly after every answer.' },
              { icon: '📊', title: 'Progress Reports', desc: 'Track your journey with visual analytics.' },
              { icon: '🏆', title: 'Compete Globally', desc: 'Climb leaderboards and challenge friends.' }
            ].map((f, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="card glass-card h-100 p-3" data-aos="zoom-in">
                  <div className="card-body">
                    <div className="display-5">{f.icon}</div>
                    <h5 className="mt-3 text-success">{f.title}</h5>
                    <p className="text-muted">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="py-5 bg-gradient" data-aos="fade-left">
        <div className="container text-center">
          <h2 className="fw-bold text-white mb-4">Your Learning Progress</h2>
          <div id="progressChart" style={{ height: '400px' }}></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section py-5" data-aos="fade-right">
        <div className="container text-center">
          <h2 className="fw-bold text-white mb-4">What Our Users Say</h2>
          <div className="row g-4">
            {[
              { name: 'Aarav', text: "This platform helped me ace my exams!", avatar: '👨‍🎓' },
              { name: 'Isha', text: "I love the instant feedback system.", avatar: '👩‍🏫' },
              { name: 'Kunal', text: "The UI and experience is just amazing.", avatar: '🧑‍💻' }
            ].map((user, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 p-3 bg-light text-dark rounded-4 shadow-lg">
                  <div className="card-body">
                    <div className="display-4">{user.avatar}</div>
                    <p className="mt-3">{user.text}</p>
                    <h6 className="text-success mt-2">- {user.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-white-50 py-4 bg-black">
        Made with 💚 by Divyansh | © {new Date().getFullYear()} QuizMaster
      </footer>
    </div>
  );
}
