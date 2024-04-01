
import React from 'react';
import BarChart from '../components/BarChart'; // Importing the BarChart component
import PieChart from '../components/PieChart'; // Importing the PieChart component


// Requirement 2: Graph Visualization
// This component represents the Graph route of the SPA and displays both bar and pie charts.

function GraphPage({ data }) {
  return (
    <div>
      <h1>Graph Page</h1>
      {data && (
        <>
          <BarChart data={data} />
          <PieChart data={data} /> 
        </>
      )}
    </div>
  );
}

export default GraphPage;
