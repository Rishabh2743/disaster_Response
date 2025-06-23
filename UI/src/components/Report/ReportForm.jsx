import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
  const [text, setText] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [disasterId, setDisasterId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`/api/verify-image/${disasterId}`, { image_url });
    alert('Image verification submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input value={disasterId} onChange={(e) => setDisasterId(e.target.value)} placeholder="Disaster ID" className="input" required />
      <input value={image_url} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="input" required />
      <button type="submit" className="btn btn-blue">Submit Report</button>
    </form>
  );
};

export default ReportForm;