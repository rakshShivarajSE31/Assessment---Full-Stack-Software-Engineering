import React from 'react';
import './Home.css';


//normally designed the home page regarding the assignment
function Home() {
  return (
    <div className="home-container">
      <div className="header">
        <h1 className="heading">Intel</h1>
        <p className="description">
          Intel is uniquely positioned to capitalize as the entire world becomes digital 
         with the depth and breadth of software, silicon and platforms, and packaging and process with at-scale manufacturing. 
          This represents Intel's pinnacle, where it consistently demonstrates exceptional prowess and singular distinction.
        </p>
      </div>
      <div className="question">
        <h2 className="subheading">Full Stack Software Engineer Coding Assessment</h2>
        <p className="question-description">
          Build a Data Visualization and Management Application
        </p>
        <p className="question-overview">
          Overview: Asked in building a single-page application (SPA) that serves as a data visualization and management tool. The application should allow users to visualize data in the form of graphs and tables, along with providing features for data manipulation and comparison.
        </p>
        <ul className="question-list">
          <li>SPA with Routing</li>
          <li>Graph Visualization</li>
          <li>Table Management</li>
          <li>Additional Features</li>
          <li>Bonus Question</li>
        </ul>
       
      </div>
    </div>
  );
}

export default Home;