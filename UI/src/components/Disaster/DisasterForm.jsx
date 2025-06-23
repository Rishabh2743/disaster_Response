import React, { useState } from 'react';
import api from '../../api/api';

const DisasterForm = () => {
  const [form, setForm] = useState({
    title: '',
    location_name: '',
    description: '',
    tags: '',
    owner_id: 'admin1'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/disasters', {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim())
      });
      alert('✅ Disaster Created');
      setForm({ title: '', location_name: '', description: '', tags: '', owner_id: 'admin1' });
    } catch (err) {
      alert('❌ Error creating disaster');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">Create New Disaster</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Disaster Title"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="location_name">Location Name</label>
          <input
            id="location_name"
            name="location_name"
            value={form.location_name}
            onChange={handleChange}
            placeholder="Location Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Disaster Description"
            rows="4"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. flood, emergency"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DisasterForm;
