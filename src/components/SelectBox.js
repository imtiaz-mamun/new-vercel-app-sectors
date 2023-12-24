// src/components/SelectBox.js
import React, { useEffect, useState } from 'react';

const SelectBox = ({ onSelectChange }) => {
  const [sectors, setSectors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/sectors');

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setSectors(data.sectors);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch sectors');
      }
    };

    fetchSectors();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <select onChange={(e) => onSelectChange(e.target.value)}>
      <option value="">Select Sector</option>
      {sectors.map((sector) => (
        <option key={sector} value={sector}>
          {sector}
        </option>
      ))}
    </select>
  );
};

export default SelectBox;
