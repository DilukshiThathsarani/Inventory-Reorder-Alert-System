import { useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';

import axiosInstance from '../axiosConfig';
import InventoryTable from '../components/InventoryTable';
import AddNewItemModal from '../components/AddNewItemModal';

const Inventory = () => {
      const { register, handleSubmit, reset } = useForm();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const [items, setItems] = useState([]);

  const [showAddNewModal, setShowAddNewModal] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get('/api/inventory/item', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(response.data);

    } catch (error) {
      alert('Failed to fetch Items.');
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const handleSearch = async (data) => {
    try {
      const queryParams = new URLSearchParams();

      if (data.itemName) queryParams.append("itemName", data.itemName);
      if (data.itemDescription) queryParams.append("itemDescription", data.itemDescription);
      if (data.itemAvailableQty) queryParams.append("itemAvailableQty", data.itemAvailableQty);

      const queryString = queryParams.toString();

      const response = await axiosInstance.get(`/api/inventory/item/search?${queryString}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setItems(response.data);
    } catch (error) {
      alert("Failed to fetch items.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory</h1>
      <h4 className="text-xl font-semibold mb-4">Search Items</h4>

{/* Search Section */}
<div className="flex flex-col md:flex-row md:items-center gap-4">
  <form
    onSubmit={handleSubmit(handleSearch)}  // <-- pass the function, not call it
    className="flex flex-col md:flex-row md:items-center gap-4 flex-grow"
  >
    <input
      type="text"
      placeholder="Search by Item Name"
      {...register('itemName')}
      className="border border-black px-4 py-2"
    />
    <input
      type="text"
      placeholder="Search by Description"
      {...register('itemDescription')}
      className="border border-black px-4 py-2"
    />
    <input
      type="number"
      placeholder="Search by Quantity"
      min="0"
      {...register('itemAvailableQty')}
      className="border border-black px-4 py-2"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
    >
      Search
    </button>
  </form>

  <button
    type="button"
    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 whitespace-nowrap"
    onClick={() => setShowAddNewModal(true)}
  >
    Add new Item
  </button>
</div>

      <InventoryTable items={items} user={user} fetchItems={() => fetchItems()}></InventoryTable>

      {showAddNewModal && (
        <AddNewItemModal
          closeModal={() => {
            setShowAddNewModal(false);
            fetchItems();
          }}
          user={user}
        />
      )}
    </div>
  );

};

export default Inventory;
