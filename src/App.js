
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GraphPage from './pages/GraphPage';
import TablePage from './pages/TablePage';
import NavigationBar from './components/NavigationBar';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Home from './components/Home';
import Footer from './components/Footer';

import './App.css';

const App = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/API_DATA.json');
        const data = await response.json();
        console.log('Fetched data:', data); // Add this line
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <Router>
      <div>
        <NavigationBar />
        {isLoading ? (
          <div>Loading data...</div>
        ) : (
          <Routes>
            <Route exact path="/" element={<Home />} /> {/* Route for the Home component */} 
            <Route exact path="/graph"
              element={
                <>
                  <GraphPage />
                  <BarChart data={data} />
                  <PieChart data={data} />
                </>
              }
            />
            <Route exact path="/table" element={<TablePage data={data} initialData={data} />} />
          </Routes>         
        )}
        <Footer />
      </div>
    </Router>
  );
};

export default App;