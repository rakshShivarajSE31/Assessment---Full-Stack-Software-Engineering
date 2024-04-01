// chart is plotted based on the number of cores and cache size (in MB) of processors. 
// The x-axis represents processor names, while the y-axis represents either the number of cores or cache size 
// depending on the dataset.


import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';



// Requirement 2: Graph Visualization (25 points)
// This component represents a bar chart visualization.

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // here component receives the data as a prop from its parent component, which is in the DataLoader component.
  useEffect(() => {
    if (!data) return;

    // Filter data based on search term
    const filtered = Object.values(data).filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // setFilteredData(filtered);
    
    //here i am extracting data for the chart
    const chartData = {
      labels: filtered.map(item => item.name),
      datasets: [
        {
          label: '# of Cores',
          data: filtered.map(item => {
            const performance = item.Performance;
            return performance && performance['# of Cores']
              ? parseInt(performance['# of Cores'])
              : 0;
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Cache (MB)',
          data: filtered.map(item => {
            const performance = item.Performance;
            return performance && performance.Cache
              ? parseFloat(performance.Cache.split(' ')[0])
              : 0;
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
    };

    //rendering the bar chat
    const ctx = chartRef.current.getContext('2d');
    const barChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });

    return () => {
      barChart.destroy();
    };
  }, [data, searchTerm]);

  // Handle changes in the search term
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div >
      {/* Search input for filtering data */}
      <input
        type="text"
        placeholder="Search processor name..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        style={{ marginLeft: '50px', display: 'flex'}}
        
      />
      {/* Canvas for rendering the bar chart */}
      <canvas ref={chartRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default BarChart;
