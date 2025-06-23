import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResourcesList = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const res = await axios.get('/api/resources/1?lat=40.7831&lon=-73.9712');
    setResources(res.data);
  };

  return (
    <ul className="list-disc pl-5">
      {resources.map((r, i) => (
        <li key={i}>{r.name || 'Resource'} - {r.distance.toFixed(1)}m away</li>
      ))}
    </ul>
  );
};

export default ResourcesList;