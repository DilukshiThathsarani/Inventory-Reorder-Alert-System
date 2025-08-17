const inventoryItem = require('../models/inventoryItem');


const addInventoryItem = async (
    req,
    res) => {
    const { itemName, itemDescription, itemAvailableQty } = req.body;
    try {
        const item = await inventoryItem.create({ itemName, itemDescription, itemAvailableQty, userId: req.user.id, });
        res.status(201).json(item);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getAllInventoryItems = async (
    req,
    res) => {
    try {
        const items = await inventoryItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateInventoryItem = async (req, res) => {
    const { itemName, itemDescription, itemAvailableQty } = req.body;

    try {
        const item = await inventoryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        item.itemName = itemName || item.itemName;
        item.itemDescription = itemDescription || item.itemDescription;
        item.itemAvailableQty = itemAvailableQty ?? item.itemAvailableQty;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const deleteInventoryItem = async (
    req,
    res) => {
    try {
        const item = await inventoryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Inventory Item not found' });
        await item.remove();
        res.json({ message: 'Inventory Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInventoryItemsByFields = async (req, res) => {
  try {
    const { itemName, itemDescription, itemAvailableQty } = req.query;
    let query = {};

    if (itemName) {
      query.itemName = itemName;
    }

    if (itemDescription) {
      query.itemDescription = itemDescription;
    }

    if (itemAvailableQty !== undefined) {
      query.itemAvailableQty = Number(itemAvailableQty);
    }

    const items = await inventoryItem.find(query);

    console.log(items)
    console.log(req.body)
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItemsByFields };