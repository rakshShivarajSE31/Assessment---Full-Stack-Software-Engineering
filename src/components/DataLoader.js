
import React, { useEffect, useState } from 'react';

const DataLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/API_DATA.json'); // Fetching data from the API endpoint
        const data = await response.json();
        setData(data);
        setIsLoading(false); // Updating loading state once data is fetched
      } catch (error) {
        setError(error); //am handling the erros
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return children({ data });
};

export default DataLoader;