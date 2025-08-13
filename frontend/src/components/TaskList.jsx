import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const InventoryList = ({ inventories, setInventories, setEditingInventories }) => {
  const { user } = useAuth();

  const handleDelete = async (inventoryId) => {
    try {
      await axiosInstance.delete(`/api/inventories/${inventoryId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setInventories(inventories.filter((inventory) => inventory._id !== inventoryId));
    } catch (error) {
      alert('Failed to delete inventory.');
    }
  };

  return (
    <div>
      {inventories.map((inventory) => (
        <div key={inventory._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{inventory.title}</h2>
          <p>{inventory.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(inventory.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingInventories(inventory)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(inventory._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;
