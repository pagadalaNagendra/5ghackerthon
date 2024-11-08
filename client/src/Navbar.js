import React, { useState } from "react";
import "./App.css"; // Import the CSS styles
import 'font-awesome/css/font-awesome.min.css'; 

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="hamburger-btn" onClick={toggleSidebar}>☰</button>
          <img
            src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1721754287/left_xfp4qb.png"
            alt="Left Logo"
            className="logo"
          />
        </div>
        <div className="navbar-title">
          <h1>5g Usecases</h1>
        </div>
        <div className="navbar-right">
          <img
            src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1721739306/smartcity_jgrecd.png"
            alt="Right Logo"
            className="logos"
          />
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "close"}`}>
      <ul className="but">
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

export default Navbar;
