import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const [quizOver, setQuizOver] = useState(false);
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.get(`${import.meta.env.VITE_APP}/getusername`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        withCredentials:true
      })
      .then(response => {
        if (response.data.username) {
          setUsername(response.data.username);
        }
      })
      .catch(() => toast.error("Failed to fetch username"));
    }
  }, []);

  useEffect(() => {
    let interval;
    if (quizOver) {
      interval = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev < score) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [quizOver, score]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  const fetchQuestions = async () => {
    const res = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple');
    console.log(res)
    const decode = (text) => new DOMParser().parseFromString(text, "text/html").body.textContent;

    const formatted = res.data.results.map((q) => {
      const options = [...q.incorrect_answers, q.correct_answer]
        .map(decode)
        .sort(() => Math.random() - 0.5);

      return {
        text: decode(q.question),
        options,
        correctAnswer: decode(q.correct_answer)
      };
    });

    setQuestions(formatted);
    setCurrentIndex(0);
    setQuizOver(false);
    setScore(0);
    setAnimatedScore(0);
  };

  const handleSubmit = () => {
    if (!selected) return;

    const isCorrect = selected === questions[currentIndex].correctAnswer;
    setResult(isCorrect ? '✅ Correct!' : '❌ Wrong!');
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setSelected('');
      setResult('');
      if (currentIndex + 1 === questions.length) {
        setQuizOver(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1000);
  };

  const savePerformance = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    try {
      const res = await axios.post(
        //'http://localhost:3000/saveperformance',
        `${import.meta.env.VITE_APP}/saveperformance`,
        { score, total: questions.length },{withCredentials:true},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || 'Performance saved!');
    } catch {
      toast.error("Failed to save performance");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cookie2');
    localStorage.removeItem('username');
    toast('Goodbye! 👋', { icon: '🚪' });
    setTimeout(() => navigate("/login"), 1000);
  };

  const viewHistory = () => {
    navigate("/history");
  };

  const question = questions[currentIndex];

  return (
    <div className={darkMode ? "bg-dark text-white min-vh-100 py-5" : "min-vh-100 py-5"} style={{ backgroundImage: !darkMode ? 'linear-gradient(to bottom right, #a8e063, #56ab2f)' : 'none' }}>
      <Toaster />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>👋 Welcome, <strong>{username}</strong></h4>
          <div>
            <button className="btn btn-sm btn-outline-light me-2" onClick={toggleDarkMode}>
              {darkMode ? '☀ Light' : '🌙 Dark'} Mode
            </button>
            <button className="btn btn-dark me-2" onClick={fetchQuestions}>🧠 New Quiz</button>
            <button className="btn btn-info me-2" onClick={viewHistory}>📜 History</button>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {quizOver ? (
            <div className={`card p-4 shadow-lg rounded-4 ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'} text-center`}>
              <h3 className="text-success">🎉 Quiz Completed!</h3>
              <motion.p className="fw-bold display-6" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                Score: {animatedScore} / {questions.length}
              </motion.p>
              <button className="btn btn-success m-2" onClick={savePerformance}>💾 Save</button>
              <button className="btn btn-outline-primary m-2" onClick={fetchQuestions}>🔁 Retry</button>
            </div>
          ) : question ? (
            <div className={`card p-4 shadow-lg rounded-4 ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'}`}>
              <h5 className="text-muted">Question {currentIndex + 1} of {questions.length}</h5>
              <h4 className="fw-bold text-primary mb-3">{question.text}</h4>
              <div className="mb-3">
                {question.options.map((opt, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="option"
                      id={`opt${idx}`}
                      value={opt}
                      checked={selected === opt}
                      onChange={() => setSelected(opt)}
                    />
                    <label className="form-check-label" htmlFor={`opt${idx}`}>{opt}</label>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-warning" onClick={handleSubmit}>✔ Submit</button>
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  disabled={currentIndex === questions.length - 1}
                >
                  ➡ Next
                </button>
              </div>
              {result && (
                <p className={`mt-3 fw-bold text-center ${result.includes('Correct') ? 'text-success' : 'text-danger'}`}>{result}</p>
              )}
            </div>
          ) : (
            <p className="text-center text-white">Start the quiz to load questions</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
