
//3rd question; 4th --> 1s question; and bonus questions implementations 
import React, { useState, useEffect, useCallback } from 'react';
import './Table.css';
import { utils, writeFile } from 'xlsx';
import './Footer.css'
import Footer from './Footer';

const TableComponent = ({ initialData }) => {

   // State variables which i am taking
  console.log('Received initialData:', initialData); 
  const [currentPage, setCurrentPage] = useState(1); //page number
  const [itemsPerPage, setItemsPerPage] = useState(10); //Number of items per page
  const [filteredData, setFilteredData] = useState([]); //Filtered data based on search
  const [currentItems, setCurrentItems] = useState([]); //Current items to display on the table
  const [searchQuery, setSearchQuery] = useState(''); //Search query
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [filters, setFilters] = useState({}); // Filters applied to the data
  const [selectedRows, setSelectedRows] = useState([]); // Selected rows for comparison
  const [editedRow, setEditedRow] = useState(null); //edited row
  const [editedData, setEditedData] = useState({}); // Edited data for the row
  const [data, setData] = useState(null); // Data received from API or local storage

  


  // Effect to load initial data from local storage or props
  useEffect(() => {
    const storedData = localStorage.getItem('tableData');
    if (storedData) {
      console.log('Data loaded from local storage:', JSON.parse(storedData));
      setData(JSON.parse(storedData));
    } else if (initialData) {
      console.log('Initial data:', initialData);
      setData(initialData);
    } else {
      console.log('Both initialData and localStorage are undefined/null');
    }
  }, [initialData]);



  // Get unique filter values
  const getUniqueFilterValues = (data, filterPath) => {
    if (!data || typeof data !== 'object') {
      return [];
    }
    const uniqueValues = new Set();
    for (const item of Object.values(data)) {
      const value = item.Performance && item.Performance['# of Cores'];
      if (value) {
        uniqueValues.add(value);
      }
    }
    return Array.from(uniqueValues);
  };

  const coresFilterValues = data ? getUniqueFilterValues(data, 'Performance.# of Cores') : [];
  const tdpFilterValues = data ? Array.from(new Set(Object.values(data).map((item) => item.Performance?.TDP || ''))).filter(Boolean) : [];

  //page - items per page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handling items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // Handling search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
  };

  // Filtering data based on search and filters
  const filterData = useCallback(() => {
    if (data && typeof data === 'object') {
      const filtered = Object.entries(data).filter(([key, item]) => {
        let shouldInclude = true;

        for (const [filterName, filterValue] of Object.entries(filters)) {
          if (filterName === 'Performance.# of Cores') {
            if (
              filterValue !== '' &&
              item.Performance &&
              item.Performance['# of Cores'] !== filterValue
            ) {
              shouldInclude = false;
              break;
            }
          } else if (filterName === 'Performance.TDP') {
            if (
              filterValue !== '' &&
              item.Performance &&
              item.Performance.TDP !== undefined &&
              item.Performance.TDP.toString() === filterValue
            ) {
              shouldInclude = true;
            } else if (filterValue === '') {
              shouldInclude = true;
            } else {
              shouldInclude = false;
              break;
            }
          } else if (
            filterName.includes('.') &&
            item[filterName.split('.')[0]] &&
            item[filterName.split('.')[0]][filterName.split('.')[1]] !== filterValue
          ) {
            shouldInclude = false;
            break;
          } else if (item[filterName] !== filterValue) {
            shouldInclude = false;
            break;
          }
        }

        // Check if the item matches the search query
        shouldInclude =
          shouldInclude &&
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          );

        return shouldInclude;
      });

      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [data, searchQuery, filters]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    setCurrentItems(filteredData.slice(0, itemsPerPage));
    setCurrentPage(1);
  }, [filteredData, itemsPerPage]);

  if (!data) {
    return <div>No data available.</div>;
  }

  // Lazy loading
  const loadMoreData = () => {
    setIsLoading(true);
    // Simulating data fetching delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const nextIndexOfLastItem = nextPage * itemsPerPage;
      const nextIndexOfFirstItem = nextIndexOfLastItem - itemsPerPage;
      const nextItems = filteredData.slice(nextIndexOfFirstItem, nextIndexOfLastItem);

      setCurrentItems((prevItems) => [...prevItems, ...nextItems]);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 1000);
  };

  // Handle row selection
  const handleRowSelect = (key) => {
    const selectedIndex = selectedRows.indexOf(key);
    let newSelectedRows = [];
    if (selectedIndex === -1) {
      newSelectedRows = [...selectedRows, key];
    } else {
      newSelectedRows = selectedRows.filter((selectedKey) => selectedKey !== key);
    }
    if (newSelectedRows.length > 2) {
      newSelectedRows = newSelectedRows.slice(1);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle row editing
  const handleEdit = (key) => {
    const rowData = data[key];
    setEditedRow(key);
    setEditedData(rowData);
  };

  // Handling save after editing
  const handleSave = (key) => {
    const updatedData = { ...data };
    updatedData[key] = editedData;
    setData(updatedData);
    setEditedRow(null);
    setEditedData({});

    // Save the updated data to local storage
    localStorage.setItem('tableData', JSON.stringify(updatedData));
  };

  // Handling cancel after editing
  const handleCancel = () => {
    setEditedRow(null);
    setEditedData({});
  };

  // Export to Excel
  const exportToExcel = () => {
    const headers = ['Name', 'Processor Base Frequency', 'Lithography', 'TDP'];
    const data = filteredData.map(([_, item]) => [
      item.name,
      item.Performance?.['Processor Base Frequency'] ?? '',
      item.Essentials?.['Lithography'] ?? '',
      item.Performance?.['TDP'] ?? '',
    ]);

    const ws = utils.aoa_to_sheet([headers, ...data]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, 'exported_data.xlsx');
  };




  return data && Object.keys(data).length > 0 ? (
  
    <div className="main-container">
      <h2>Table Component</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="coresFilter">Filter by # of Cores:</label>
          <select
            id="coresFilter"
            value={filters['Performance.# of Cores'] || ''}
            onChange={(e) =>
              handleFilterChange('Performance.# of Cores', e.target.value)
            }
          >
            <option value="">All</option>
            {coresFilterValues.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="tdpFilter">Filter by TDP:</label>
          <select
            id="tdpFilter"
            value={filters['Performance.TDP'] || ''}
            onChange={(e) =>
              handleFilterChange('Performance.TDP', e.target.value)
            }
          >
            <option value="">All</option>
            {tdpFilterValues.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Comparison</th>
              <th>Name</th>
              <th>Processor Base Frequency</th>
              <th>Lithography</th>
              <th>TDP</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(([key, item]) =>
              editedRow === key ? (
                <tr key={key}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(key)}
                      onChange={() => handleRowSelect(key)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedData.name || ''}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedData.Performance?.['Processor Base Frequency'] || ''}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          Performance: {
                            ...editedData.Performance,
                            'Processor Base Frequency': e.target.value,
                          },
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedData.Essentials?.['Lithography'] || ''}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          Essentials: {
                            ...editedData.Essentials,
                            Lithography: e.target.value,
                          },
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedData.Performance?.['TDP'] || ''}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          Performance: {
                            ...editedData.Performance,
                            TDP: e.target.value,
                          },
                        })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(key)} style={{ backgroundColor: 'green', color: 'white' }}>Save</button>
                    <button onClick={handleCancel} style={{ backgroundColor: 'red', color: 'white' }}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr
                  key={key}
                  className={selectedRows.includes(key) ? 'selected' : ''}
                  onClick={() => handleRowSelect(key)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(key)}
                      onChange={() => handleRowSelect(key)}
                    />
                  </td>
                  <td>{item?.name || ''}</td>
                  <td>{item?.Performance?.['Processor Base Frequency'] || ''}</td>
                  <td>{item?.Essentials?.['Lithography'] || ''}</td>
                  <td>{item?.Performance?.['TDP'] || ''}</td>
                  <td>
                    {/* <button onClick={() => handleEdit(key)}>Edit</button> */}
                    <button onClick={() => handleEdit(key)} style={{ backgroundColor: 'orange', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>

                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <div className="items-per-page">
          <span>Items per page:</span>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="20">50</option>
            <option value="100">100</option>
          </select>
        </div>
                  
        

        <div className="load-more">
          {isLoading && <div>Loading more data...</div>}
          {!isLoading && currentItems.length < filteredData.length && (
            <button onClick={loadMoreData}>Load More</button>
          )}
        </div>

        <div className="total-rows">
          <span>Total rows: {filteredData.length}</span>
        </div>

        <div className="export-excel">
          <button onClick={exportToExcel}>Export to Excel</button>
        </div>
      </div>

      <div className="comparison-section">
        <h3>Selected Rows for Comparison:</h3>
        <div className="comparison-rows">
          {selectedRows.map((key) => {
            const item = data[key];
            if (!item) return null;

            return (
              <div key={key} className="comparison-row">
                <p>Name: {item.name}</p>
                <p>Processor Base Frequency: {item.Performance?.['Processor Base Frequency'] || ''}</p>
                <p>Lithography: {item.Essentials?.['Lithography'] || ''}</p>
                <p>TDP: {item.Performance?.['TDP'] || ''}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  
  ) : (
    <div>Loading...</div>
  );
};

export default TableComponent;

