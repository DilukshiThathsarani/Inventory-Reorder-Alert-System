
const express = require('express');
const { getAllInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItemsByFields } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getAllInventoryItems).post(protect, addInventoryItem);
router.route('/:id').put(protect, updateInventoryItem).delete(protect, deleteInventoryItem);
router.get('/search', getInventoryItemsByFields);

module.exports = router;

