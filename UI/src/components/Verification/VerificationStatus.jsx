import React, { useState } from 'react';
import axios from 'axios';

const VerificationStatus = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');

  const verify = async () => {
    const res = await axios.post('/api/verify-image/1', { image_url: url });
    setResult(res.data.verification);
  };

  return (
    <div className="space-y-2">
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL" className="input" />
      <button onClick={verify} className="btn btn-blue">Verify</button>
      {result && <p className="text-green-600">Result: {result}</p>}
    </div>
  );
};

export default VerificationStatus;