import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import DisasterActions from './DisasterActions';
import DisasterUpdateForm from './DisasterUpdateForm';

const DisasterList = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDisaster, setEditingDisaster] = useState(null);

  const fetchDisasters = async () => {
    setLoading(true);
    try {
      const res = await api.get('/disasters');
      setDisasters(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch disasters:', err);
      setError('Failed to load disasters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  const handleUpdateSubmit = async (updatedData) => {
    try {
      await api.put(`/updateDisasters/${updatedData.id}`, updatedData);
      alert('✅ Disaster updated successfully');
      setEditingDisaster(null);
      fetchDisasters();
    } catch (err) {
      console.error('❌ Failed to update:', err);
      alert('❌ Update failed.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">Disaster List</h2>

      {loading ? (
        <p className="text-gray-600">Loading disasters...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Location Name</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Tags</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disasters.map((d) => (
                <tr key={d.id} className="text-center border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border font-medium text-gray-800">{d.title}</td>
                  <td className="px-4 py-2 border text-gray-600">{d.location_name}</td>
                  <td className="px-4 py-2 border text-gray-600">{d.description}</td>
                  <td className="px-4 py-2 border text-gray-600">{d.tags?.join(', ')}</td>
                  <td className="px-4 py-2 border">
                    <DisasterActions
                      disaster={d}
                      fetchDisasters={fetchDisasters}
                      onUpdateClick={(disaster) => setEditingDisaster(disaster)}
                    />
                  </td>
                </tr>
              ))}
              {disasters.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-gray-500 italic">
                    No disasters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Update Form */}
      {editingDisaster && (
        <DisasterUpdateForm
          disaster={editingDisaster}
          onClose={() => setEditingDisaster(null)}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </div>
  );
};

export default DisasterList;
