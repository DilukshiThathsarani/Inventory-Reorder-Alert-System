
const express = require('express');
const { getInventory, addInventory, updateInventory, deleteInventory } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getInventory).post(protect, addInventory);
router.route('/:id').put(protect, updateInventory).delete(protect, deleteInventory);

module.exports = router;

