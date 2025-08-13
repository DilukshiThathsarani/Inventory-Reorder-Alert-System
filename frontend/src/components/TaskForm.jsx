import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const InventoryForm = ({ inventories, setInventories, editingInventories, setEditingInventories }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    if (editingInventories) {
      setFormData({
        title: editingInventories.title,
        description: editingInventories.description,
        deadline: editingInventories.deadline,
      });
    } else {
      setFormData({ title: '', description: '', deadline: '' });
    }
  }, [editingInventories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInventories) {
        const response = await axiosInstance.put(`/api/inventories/${editingInventories._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInventories(inventories.map((inventory) => (inventory._id === response.data._id ? response.data : inventory)));
      } else {
        const response = await axiosInstance.post('/api/inventories', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInventories([...inventories, response.data]);
      }
      setEditingInventories(null);
      setFormData({ title: '', description: '', deadline: '' });
    } catch (error) {
      alert('Failed to save inventory.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingInventories ? 'Your Form Name: Edit Operation' : 'Your Form Name: Create Operation'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingInventories ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default InventoryForm;
