import axiosInstance from '../axiosConfig';
import { useForm } from "react-hook-form";


const UpdateItemModal = ({ selectedItem, closeModal, user }) => {
  const { register, handleSubmit, reset } = useForm();
  console.log(selectedItem)
  const onSubmit = async (data) => {
    try {
      await axiosInstance.put(`/api/inventory/item/${selectedItem._id}`, data, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      reset();
      closeModal();
      alert("Item updated Successfully!");
    } catch (error) {
      alert("Error updating item");
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Update Item</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            defaultValue={selectedItem.itemName}
            readOnly
            placeholder="Item Name"
            className="border border-gray-400 p-2 mb-4 w-full bg-gray-100 cursor-not-allowed"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            itemDescription
          </label>
          <input
            {...register("itemDescription")}
            defaultValue={selectedItem.itemDescription}
            type="text"
            placeholder="Description"
            className="border border-gray-400 p-2 mb-4 w-full"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Quantity
          </label>
          <input
            {...register("itemAvailableQty", { valueAsNumber: true, min: 0 })}
            type="number"
            defaultValue={selectedItem.itemAvailableQty}
            placeholder="Available Quantity"
            min="0"
            className="border border-gray-400 p-2 mb-4 w-full"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                reset();
                closeModal();
              }}
              className="px-4 py-2 rounded border border-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateItemModal;
