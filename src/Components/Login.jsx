import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; // optional for custom gradient bg or tweaks

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_APP}/login`, {
        username,
        password,
      },{
        withCredentials:true
      });

      if (res.data.message === "success") {
        localStorage.setItem('token', res.data.token);
        navigate("/home");
      } else {
        setErrorMsg(res.data.message || 'Login failed.');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
      console.error('Login Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleAdminLogin = () => {
    navigate("/adminlogin");
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-bg">
      <div className="row shadow-lg rounded-4 overflow-hidden w-100" style={{ maxWidth: '900px' }}>
        {/* Left Image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
         src="https://img.freepik.com/premium-vector/enter-otp-concept-illustration_86047-735.jpg?ga=GA1.1.81057377.1744463214&semt=ais_hybrid&w=740"
            alt="Login Illustration"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </div>

        {/* Right Form */}
        <div className="col-md-6 bg-white p-5">
          <h3 className="text-center mb-4 text-primary fw-bold">Welcome Back 👋</h3>
          <p className="text-muted text-center mb-4">Login to continue to your account</p>

          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center">{errorMsg}</div>
          )}

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-3">
            <button
              className="btn btn-secondary w-100 mt-2"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center mt-3">
            <button
              className="btn btn-danger w-100 mt-2"
              onClick={handleAdminLogin}
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
