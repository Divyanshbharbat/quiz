import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Adminlogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP}/adminlogin`, data, {
        withCredentials: true,
      });

      if (res.data.message === 'success') {
        toast.success("Login Successful 🔐");
        console.log(res.data.token2)
        localStorage.setItem("cookie2", res.data.token2);
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      }
    } catch (error) {
      toast.error("Access Denied ❌");
      console.error(error);
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #7F00FF, #E100FF)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Toaster />
      <div className="row w-100 align-items-center justify-content-center px-3">
        <div className="col-lg-5 col-md-8" data-aos="fade-up">
          <div
            className="p-5 rounded-4 shadow-lg text-white"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
            }}
          >
            <h2 className="text-center mb-4 fw-bold">🔐 Admin Portal</h2>
            <p className="text-center mb-4 text-white-50">For Authorized Personnel Only</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mb-4">
                <input
                  type="text"
                  {...register("admin", { required: "Admin email is required" })}
                  className="form-control form-control-lg"
                  placeholder="Admin Email"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)"
                  }}
                />
                {errors.admin && <p className="text-danger mt-2">{errors.admin.message}</p>}
              </div>

              <div className="form-group mb-4">
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  className="form-control form-control-lg"
                  placeholder="Password"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)"
                  }}
                />
                {errors.password && <p className="text-danger mt-2">{errors.password.message}</p>}
              </div>

              <div className="mb-3 text-end">
                <NavLink to="/contact" className="text-decoration-none text-white-50">
                  Forgot password?
                </NavLink>
              </div>

              <div className="d-flex justify-content-between">
                <NavLink to="/signup" className="btn btn-outline-light px-4">Signup</NavLink>
                <button type="submit" className="btn btn-light px-5 fw-semibold">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side visual */}
        <div className="col-lg-6 mt-5 mt-lg-0 text-center" data-aos="fade-left">
          <img
            src="https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7872.jpg?ga=GA1.1.109368830.1743779497&semt=ais_hybrid&w=740"
            alt="Admin Illustration"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxHeight: '480px', width: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;