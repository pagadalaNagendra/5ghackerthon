import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './indoorair.css'; // Updated the CSS filename
import 'font-awesome/css/font-awesome.min.css';

// TemperatureChart component
const TemperatureChart = ({ data, onClick }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ff6a00" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#ff9a00" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis domain={[0, 'auto']} />
      <Tooltip />
      <Legend
        formatter={() => (
          <span>
            <i
              className="fa fa-thermometer-half"
              aria-hidden="true"
              style={{ color: '#ff7300', marginRight: '5px' }}
            />
            Temperature
          </span>
        )}
      />
      <Area
        type="monotone"
        dataKey="temperature"
        stroke="#ff7300"
        fill="url(#temperatureGradient)"
        onClick={(e) => {
          if (e && e.activePayload && e.activePayload.length) {
            onClick(e.activePayload[0].payload, 'temperature');
          }
        }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

// HumidityChart component
const HumidityChart = ({ data, onClick }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#00c9ff" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#92fe9d" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis domain={[0, 'auto']} />
      <Tooltip />
      <Legend
        formatter={() => (
          <span>
            <i
              className="fa fa-tint"
              aria-hidden="true"
              style={{ color: '#00bfff', marginRight: '5px' }}
            />
            Humidity
          </span>
        )}
      />
      <Area
        type="monotone"
        dataKey="humidity"
        stroke="#00bfff"
        fill="url(#humidityGradient)"
        onClick={(e) => {
          if (e && e.activePayload && e.activePayload.length) {
            onClick(e.activePayload[0].payload, 'humidity');
          }
        }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="sensor-navbar">
        <div className="sensor-navbar-left">
          <button className="sensor-hamburger-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <img
            src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1721754287/left_xfp4qb.png"
            alt="Left Logo"
            className="sensor-left-logo"
          />
        </div>
        <div className="sensor-navbar-title">
          <h1>5G Use Cases</h1>
        </div>
        <div className="sensor-navbar-right">
          <img
            src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1721739306/smartcity_jgrecd.png"
            alt="Right Logo"
            className="sensor-right-logo"
          />
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sensor-sidebar ${sidebarOpen ? 'open' : 'close'}`}>
        <ul className="sensor-sidebar-list">
          <li>
            <i className="fa fa-home"></i> HomePage
          </li>
          <li>
            <i className="fa fa-leaf"></i> Indoor Air Quality
          </li>
          <li>
            <i className="fa fa-cloud"></i> Outdoor Air Quality
          </li>
          <li>
            <i className="fa fa-tint"></i> Water Quality
          </li>
        </ul>
      </div>
    </>
  );
};

// SensorDataPage component
const SensorDataPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sensor-data');
        const chartData = response.data.map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString(),
          temperature: parseFloat(item.temperature),
          humidity: parseFloat(item.humidity),
        }));
        setData(chartData);

        // Check for alerts based on multiple recent data points
        const latestData = chartData.slice(-5); // Checking the last 5 entries
        const tempAlert = latestData.find((item) => item.temperature > 30);
        const humidityAlert = latestData.find((item) => item.humidity > 30);

        if (tempAlert) {
          handleDataPointClick(tempAlert, 'temperature'); // Pass the actual data point
        }
        if (humidityAlert) {
          handleDataPointClick(humidityAlert, 'humidity'); // Pass the actual data point
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch sensor data. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchData();

    // Set up interval to fetch data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle data point click event
  const handleDataPointClick = (dataPoint, type) => {
    const value = type === 'temperature' ? dataPoint.temperature : dataPoint.humidity;
    const videoUrl =
      type === 'temperature'
        ? 'https://res.cloudinary.com/dxoq1rrh4/video/upload/v1727015888/Hot_Temperature_f9r3ej.mp4'
        : 'https://res.cloudinary.com/dxoq1rrh4/video/upload/v1727107805/Heavy_Hail_Night_a5qyxu.mp4'; // Replace this with your humidity video URL

    Swal.fire({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`,
      html: `
        <p>${type.charAt(0).toUpperCase() + type.slice(1)} has crossed the threshold</p>
        <p>Current ${type}: ${value}</p>
        <video autoplay loop muted style="width: 100%; height: 200px; pointer-events: none;">
          <source src="${videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `,
      focusConfirm: false,
      confirmButtonText: 'Close',
    });
  };

  return (
    <div>
    
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>Temperature Data</h2>
          <TemperatureChart data={data} onClick={handleDataPointClick} />
        </div>

        <div style={{ flex: 1, marginLeft: '20px' }}>
          <h2>Humidity Data</h2>
          <HumidityChart data={data} onClick={handleDataPointClick} />
        </div>
      </div>
    </div>
  );
};

export default SensorDataPage;
