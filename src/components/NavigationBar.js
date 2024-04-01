
import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/intelLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Navigation.css';
// Navigation bar component
function NavigationBar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">

        {/* normally added a small logo of intel */}
        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="Intel Logo" height="50" />
        </NavLink>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end ms-auto" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink exact to="/" className="nav-link" activeClassName="active">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-house-fill"></i>
                  <span>Home</span>
                </div>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/graph" className="nav-link" activeClassName="active">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-bar-chart-fill"></i>
                  <span>Graph</span>
                </div>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/table" className="nav-link" activeClassName="active">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-table"></i>
                  <span>Table</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
