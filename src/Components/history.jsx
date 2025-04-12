import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import AOS from "aos";
import "aos/dist/aos.css";

const History = () => {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
console.log(token)
        const res = await axios.get(`${import.meta.env.VITE_APP}/history`,{
          headers: { Authorization: `Bearer ${token}` }
        }, {withCredentials:true});

        setPerformance(res.data.reverse()); // Latest first
        setLoading(false);
      } catch (err) {
        console.error("Error fetching performance:", err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      className="container py-5"
      style={{
        fontFamily: "Poppins",
        background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient background
        color: "#fff", // White text for contrast
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="text-center mb-5" data-aos="fade-down">
        <h1 className="fw-bold" style={{ color: "#FFFAF0" }}>
          Your Quiz Performance
        </h1>
        <p className="text-light">Track your progress and growth over time</p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-light" />
        </div>
      ) : performance.length === 0 ? (
        <div className="text-center text-danger fs-4" data-aos="fade-up">
          No history found.
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-md-6" data-aos="zoom-in">
            <ul className="list-group shadow">
              {performance.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{
                    backgroundColor: "#E8F0FE",
                    borderLeft: "5px solid #0077B6",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <span>
                    <strong>Quiz {performance.length - index}</strong>
                    <br />
                    <small>Date: {new Date(item.date).toLocaleDateString()}</small>
                  </span>
                  <span className="badge bg-primary rounded-pill">
                    {item.score} / {item.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6" data-aos="zoom-in">
            <div
              className="card shadow"
              style={{
                border: "none",
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body">
                <h5 className="card-title mb-3" style={{ color: "#0077B6" }}>
                  Performance Chart
                </h5>
                <Plot
                  data={[
                    {
                      type: "bar",
                      x: performance.map((_, i) => `Quiz ${performance.length - i}`),
                      y: performance.map((p) => p.score),
                      marker: { color: "#0077B6" },
                    },
                  ]}
                  layout={{
                    width: 450,
                    height: 300,
                    title: "Scores Over Time",
                    plot_bgcolor: "#f8f9fa",
                    paper_bgcolor: "#f8f9fa",
                    titlefont: {
                      size: 20,
                      family: "Poppins, sans-serif",
                      color: "#0077B6",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
