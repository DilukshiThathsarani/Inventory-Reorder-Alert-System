const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemDescription: { type: String },
  itemAvailableQty: { type: Number, required: true, min: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
