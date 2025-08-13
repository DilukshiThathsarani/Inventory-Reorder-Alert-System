const Inventory = require('../models/Inventory');
const getInventory = async (
req,
res) => {
try {
const tasks = await Inventory.find({ userId: req.user.id });
res.json(tasks);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


const addInventory = async (
req,
res) => {
const { title, description, deadline } = req.body;
try {
const inventory = await Inventory.create({ userId: req.user.id, title, description, deadline });
res.status(201).json(inventory);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


const updateInventory = async (
req,
res) => {
const { title, description, completed, deadline } = req.body;
try {
const inventory = await Inventory.findById(req.params.id);
if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
inventory.title = title || inventory.title;
inventory.description = description || inventory.description;
inventory.completed = completed ?? inventory.completed;
inventory.deadline = deadline || inventory.deadline;
const updatedTask = await inventory.save();
res.json(updatedTask);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


const deleteInventory = async (
req,
res) => {
try {
const inventory = await Inventory.findById(req.params.id);
if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
await inventory.remove();
res.json({ message: 'Inventory deleted' });
} catch (error) {
res.status(500).json({ message: error.message });
}
};
module.exports = { getInventory, addInventory, updateInventory, deleteInventory };