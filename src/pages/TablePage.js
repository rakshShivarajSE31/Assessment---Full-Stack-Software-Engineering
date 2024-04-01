// Requirement 3: Table Management 
// This component represents a page displaying a table with various data management features.

import React from 'react';
import TableComponent from '../components/TableComponent';

const TablePage = ({ data, initialData }) => {
  return (
    <div>
      <h1>Table Page</h1>
      <TableComponent initialData={initialData} />
    </div>
  );
};

export default TablePage;