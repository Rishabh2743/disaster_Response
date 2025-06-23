import React from 'react';
import api from '../../api/api';

const DisasterActions = ({ disaster, fetchDisasters, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${disaster.title}"?`);
    if (!confirmDelete) return;
    
    try {
      await api.delete(`/disasters/${disaster.id}`);
      alert(`✅ Deleted disaster: ${disaster.title}`);
      fetchDisasters(); // refresh list
    } catch (err) {
      console.error('❌ Failed to delete disaster:', err);
      alert('❌ Error deleting disaster. Please try again.');
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => onUpdateClick(disaster)}
        className="px-3 py-1 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded"
      >
        Update
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default DisasterActions;
