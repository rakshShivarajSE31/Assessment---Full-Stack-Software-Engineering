// The pie chart is plotted based on the cache size (in MB) of processors. 
// so each slice of the pie represents the cache size of a processor, with colors indicating different cache sizes


import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './PieChart.css';


// Requirement 2: Graph Visualization 
// This component represents a pie chart visualization
const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartInstance, setChartInstance] = useState(null);

  // Custom plugin to handle hover effect - its when you hover on the particular slicee
  const hoverPlugin = {
    id: 'hoverPlugin',
    afterDraw: (chart, args, options) => {
      if (chart.getActiveElements().length > 0) {
        const ctx = chart.ctx;
        const activePoint = chart.getActiveElements()[0];
        const dataset = chart.data.datasets[activePoint.datasetIndex];
        const meta = chart.getDatasetMeta(activePoint.datasetIndex);
        const arc = meta.data[activePoint.index];

        // Highlighting the hovered slice
        ctx.save();
        ctx.beginPath();
        ctx.arc(arc.x, arc.y, arc.outerRadius * 1.1, arc.startAngle, arc.endAngle);
        ctx.arc(arc.x, arc.y, arc.innerRadius, arc.endAngle, arc.startAngle, true);
        ctx.closePath();
        ctx.fillStyle = dataset.backgroundColor[activePoint.index];
        ctx.fill();
        ctx.restore();
      }
    },
  };

  useEffect(() => {
    if (!data) return;

    // Filtering data based on search term
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        data[key].name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    //now constructing the chart
    const chartData = {
      labels: Object.keys(filteredData).map((key) => filteredData[key].name),
      datasets: [
        {
          label: 'Cache (MB)',
          data: Object.keys(filteredData).map((key) => {
            const performance = filteredData[key].Performance;
            return performance && performance.Cache ? parseFloat(performance.Cache.split(' ')[0]) : 0;
          }),
          //taking some random colors
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)', // Red
            'rgba(54, 162, 235, 0.6)', // Blue
            'rgba(255, 206, 86, 0.6)', // Yellow
            'rgba(75, 192, 192, 0.6)', // Green
            'rgba(153, 102, 255, 0.6)', // Purple
            'rgba(255, 159, 64, 0.6)', // Orange
            
        
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)', // Red
            'rgba(54, 162, 235, 1)', // Blue
            'rgba(255, 206, 86, 1)', // Yellow
            'rgba(75, 192, 192, 1)', // Green
            'rgba(153, 102, 255, 1)', // Purple
            'rgba(255, 159, 64, 1)', // Orange
          ],
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      plugins: {
        legend: {
          position: 'right',
        },
      },
      onHover: (event, chartElement) => {
        // Change cursor style based on hover
        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      },
    };
    // If a chart instance already exists, destroy it
    if (chartInstance) {
      chartInstance.destroy();
    }

    //using the canva chart
    const ctx = chartRef.current.getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: chartOptions,
      plugins: [hoverPlugin],
    });
    setChartInstance(newChartInstance);

    return () => {
      newChartInstance.destroy();
    };
  }, [data, searchTerm]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pie-chart-container">
      {/* added search - to search any relavant processor - so that it represents the slice and comparision */}
      {/* this is added because, overal plot looks bulk, if the user wants to know few relavant data */}
      <input
        type="text"
        placeholder="Search processor name..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        style={{ marginBottom: '10px', marginRight: '200px'}}
        
      />
      <canvas ref={chartRef} style={{ width: '200px', height: '200px' }} />
      {chartInstance && (
        <div style={{ marginTop: '200px' }}>
          {chartInstance.data.datasets[0].backgroundColor.map((color, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color,
                  marginRight: '10px',
                }}
              />
              <span>{chartInstance.data.labels[index]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;



