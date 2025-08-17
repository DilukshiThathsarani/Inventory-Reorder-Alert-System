import axiosInstance from '../axiosConfig';
import { useState } from 'react';
import UpdateItemModal from '../components/UpdateItemModal';

const InventoryTable = ({ items, user, fetchItems }) => {

  const [showUpdateItemModal, setShowUpdateItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/inventory/item/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      fetchItems();
      alert('Item Deleted Successfully');

    } catch (error) {
      alert('Error deleting item');
      console.error('Delete error:', error.message);
    }
  };


  return (
    <div className="overflow-x-auto mx-auto mt-6">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-left bg-gray-100">Item Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left bg-gray-100">Description</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left bg-gray-100">Available Qty</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left bg-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-300">{item.itemName}</td>
                <td className="py-2 px-4 border-b border-gray-300">{item.itemDescription}</td>
                <td className="py-2 px-4 border-b border-gray-300">{item.itemAvailableQty}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                    onClick={() => {
                      setShowUpdateItemModal(true);
                      setSelectedItem(item)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showUpdateItemModal && (
        <UpdateItemModal
          closeModal={() => {
            setShowUpdateItemModal(false);
            fetchItems();
          }}
          user={user}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
};

export default InventoryTable;
