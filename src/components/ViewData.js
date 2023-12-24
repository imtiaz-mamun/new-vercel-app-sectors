import React, { useEffect, useState } from 'react';

const ViewData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllData');

        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container blue-bg">
    {data.map((item) => (
      <div className="card" key={item.id}>
        <h3>{item.name}</h3>
        <p>ID: {item.id}</p>
        <div className="sectors">Sectors: {item.sector}</div>
        <div className="agree">Agreed to terms: {item.agree ? 'Yes' : 'No'}</div>
      </div>
    ))}
      <div className="row justify-content-center white-bg">
        <div className="col-md-12">
        <a href="/" className="back-btn-view">Back to Form</a>
        </div>
      </div>
    </div>
  );
};

export default ViewData;
