import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import './admin.css';
import { useNavigate } from 'react-router-dom';
const Admin = () => {
  const [userData, setUserData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
let navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const response = await axios.get('http://localhost:3000/api/users');
        const response = await axios.get(`${import.meta.env.VITE_APP}/api/users`);
        const users = response.data;
        setUserData(users);

        const performanceScores = users.map(user =>
          user.performance.reduce((acc, p) => acc + p.score, 0)
        );
        setPerformanceData(performanceScores);
      } catch (error) {
        setErrorMsg('Failed to fetch data. Please try again later.');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPerformanceData = () => ({
    labels: userData.map(user => user.username),
    values: performanceData,
    type: 'pie',
    marker: {
      colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33F6', '#FF9F33', '#33FFF6', '#F6FF33', '#9933FF'],
    },
    textinfo: 'label+percent',
    insidetextorientation: 'radial'
  });

  return (
    <Container fluid className="admin-dashboard py-4">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={4} className="logout-section text-center">
          <Button  onClick={()=>{
            localStorage.removeItem("cookie2")
            localStorage.removeItem("token")
            navigate("/")
          }} variant="danger" className="w-100">Logout</Button>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col xs={12} md={8}>
          <Card className="shadow-lg rounded-4 chart-card">
            <Card.Body>
              <Card.Title className="text-center text-white mb-4">User Performance Overview</Card.Title>
              {loading ? (
                <div className="text-center text-white">Loading...</div>
              ) : (
                <Plot
                  data={[getPerformanceData()]}
                  layout={{
                    title: 'User Performance',
                    paper_bgcolor: 'rgba(0, 0, 0, 0)',
                    plot_bgcolor: 'rgba(0, 0, 0, 0)',
                    showlegend: true,
                    legend: { orientation: 'h' },
                    margin: { t: 30, b: 50, l: 50, r: 50 },
                    autosize: true,
                    responsive: true,
                  }}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {errorMsg && (
        <Row className="justify-content-center mb-3">
          <Col xs={12} md={8}>
            <div className="alert alert-danger text-center">{errorMsg}</div>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8}>
          <h3 className="text-center text-dark mb-4">User Details</h3>
          <Row>
            {userData.map(user => (
              <Col key={user._id} xs={12} md={6} className="mb-4">
                <Card className="shadow user-card text-white h-100">
                  <Card.Body>
                    <Card.Title>{user.username}</Card.Title>
                    <Card.Text><strong>User ID:</strong> {user._id}</Card.Text>
                    <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                    <Card.Text>
                      <strong>Performance:</strong> {user.performance.reduce((acc, p) => acc + p.score, 0)} / 5
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
