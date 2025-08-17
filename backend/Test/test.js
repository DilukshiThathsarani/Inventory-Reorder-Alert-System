const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const InventoryItem = require('../models/inventoryItem');
const { updateInventoryItem, getAllInventoryItems, addInventoryItem, deleteInventoryItem, getInventoryItemsByFields } = require('../controllers/inventoryController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('AddInventoryItem Function Test', () => {
  sinon.spy(console, 'log');  // or just a simple use to clear warning

  it('should create a new item successfully', async () => {
    // Mock request data
    const mockUserId = new mongoose.Types.ObjectId();

    const req = {
      user: { id: mockUserId },
      body: {
        itemName: "Test Item",
        itemDescription: "Test Description",
        itemAvailableQty: 10
      }
    };


    // Mock inventory that would be created
    const createdInventoryItem = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Inventory.create to return the createdInventoryItem
    const createStub = sinon.stub(InventoryItem, 'create').resolves(createdInventoryItem);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addInventoryItem(req, res);

    // Assertions
    expect(createStub.calledOnceWithExactly({
      itemName: req.body.itemName,
      itemDescription: req.body.itemDescription,
      itemAvailableQty: req.body.itemAvailableQty,
      userId: mockUserId
    })).to.be.true;
    console.log(res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdInventoryItem)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Inventory.create to throw an error
    const createStub = sinon.stub(InventoryItem, 'create').rejects(new Error('DB Error'));


    // Mock Invalid request data
    const mockUserId = new mongoose.Types.ObjectId();
    const req = {
      user: { id: mockUserId },
      body: {
        itemName: "Invalid Item",
        itemDescription: "Should fail",
        itemAvailableQty: 5
      }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addInventoryItem(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });
});


describe('GetAllInventory Items Function Test', () => {

  it('should return all inventory items successfully', async () => {
    // Mock data
    const items = [
      { _id: new mongoose.Types.ObjectId(), itemName: "Item 1" },
      { _id: new mongoose.Types.ObjectId(), itemName: "Item 2" }
    ];

    // Stub inventoryItem.find to return mock items
    const findStub = sinon.stub(InventoryItem, 'find').resolves(items);

    // Mock request and response
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getAllInventoryItems(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(items)).to.be.true;

    findStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const findStub = sinon.stub(InventoryItem, 'find').rejects(new Error('DB Error'));

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getAllInventoryItems(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findStub.restore();
  });
});

describe('Update Inventory Item Function Test', () => {

  it('should update an inventory item successfully', async () => {
    const itemId = new mongoose.Types.ObjectId();

    const req = {
      params: { id: itemId.toString() },
      body: {
        itemName: 'Updated Name',
        itemDescription: 'Updated Description',
        itemAvailableQty: 15
      }
    };

    const existingItem = {
      _id: itemId,
      itemName: 'Old Name',
      itemDescription: 'Old Description',
      itemAvailableQty: 5,
      save: sinon.stub().resolvesThis()
    };

    const findByIdStub = sinon.stub(InventoryItem, 'findById').resolves(existingItem);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateInventoryItem(req, res);

    expect(findByIdStub.calledOnceWithExactly(itemId.toString())).to.be.true;
    expect(existingItem.save.calledOnce).to.be.true;
    expect(existingItem.itemName).to.equal('Updated Name');
    expect(existingItem.itemDescription).to.equal('Updated Description');
    expect(existingItem.itemAvailableQty).to.equal(15);
    expect(res.json.calledWith(existingItem)).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if item is not found', async () => {
    const itemId = new mongoose.Types.ObjectId();

    const req = {
      params: { id: itemId.toString() },
      body: {}
    };

    const findByIdStub = sinon.stub(InventoryItem, 'findById').resolves(null);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateInventoryItem(req, res);

    expect(findByIdStub.calledOnceWithExactly(itemId.toString())).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Inventory item not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 if a database error occurs', async () => {
    const itemId = new mongoose.Types.ObjectId();

    const req = {
      params: { id: itemId.toString() },
      body: {}
    };

    const findByIdStub = sinon.stub(InventoryItem, 'findById').rejects(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateInventoryItem(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });
});

describe('DeleteInventoryItem Function Test', () => {
  it('should delete an inventory item successfully', async () => {
    const itemId = new mongoose.Types.ObjectId();

    // Mock item to be deleted
    const mockItem = {
      _id: itemId,
      remove: sinon.stub().resolves()
    };

    // Stub findById to return the mock item
    const findByIdStub = sinon.stub(InventoryItem, 'findById').resolves(mockItem);

    const req = { params: { id: itemId.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteInventoryItem(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWithExactly(itemId.toString())).to.be.true;
    expect(mockItem.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Inventory Item deleted' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if inventory item not found', async () => {
    const itemId = new mongoose.Types.ObjectId();

    // Stub findById to return null
    const findByIdStub = sinon.stub(InventoryItem, 'findById').resolves(null);

    const req = { params: { id: itemId.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteInventoryItem(req, res);

    expect(findByIdStub.calledOnceWithExactly(itemId.toString())).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Inventory Item not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const itemId = new mongoose.Types.ObjectId();

    const findByIdStub = sinon.stub(InventoryItem, 'findById').rejects(new Error('DB Error'));

    const req = { params: { id: itemId.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteInventoryItem(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });
});

describe('Delete Inventory Item Function Test', () => {

  it('should delete an inventory item successfully', async () => {
    const itemId = new mongoose.Types.ObjectId();

    // Mock item to be deleted
    const mockItem = {
      _id: itemId,
      remove: sinon.stub().resolves()
    };

    // Stub findById to return the mock item
    const findByIdStub = sinon.stub(InventoryItem, 'findById').resolves(mockItem);

    const req = { params: { id: itemId.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteInventoryItem(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWithExactly(itemId.toString())).to.be.true;
    expect(mockItem.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Inventory Item deleted' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if inventory item not found', async () => {
    const itemId = new mongoose.Types.ObjectId();

    // Stub findById to return null
    const findByIdStub = sinon.stub(InventoryItem, 'findById').resolves(null);

    const req = { params: { id: itemId.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteInventoryItem(req, res);

    expect(findByIdStub.calledOnceWithExactly(itemId.toString())).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Inventory Item not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const itemId = new mongoose.Types.ObjectId();

    const findByIdStub = sinon.stub(InventoryItem, 'findById').rejects(new Error('DB Error'));

    const req = { params: { id: itemId.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteInventoryItem(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });
});



describe('getInventoryItemsByFields Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return all items matching query params', async () => {
    const req = {
      query: {
        itemName: 'Test Item',
        itemDescription: 'Test Description',
        itemAvailableQty: '10'
      }
    };

    const expectedQuery = {
      itemName: 'Test Item',
      itemDescription: 'Test Description',
      itemAvailableQty: 10
    };

    const mockItems = [
      { _id: new mongoose.Types.ObjectId(), itemName: 'Test Item', itemDescription: 'Test Description', itemAvailableQty: 10 }
    ];

    const findStub = sinon.stub(InventoryItem, 'find').resolves(mockItems);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getInventoryItemsByFields(req, res);

    expect(findStub.calledOnceWithExactly(expectedQuery)).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockItems)).to.be.true;
  });

  it('should build query only with provided fields', async () => {
    const req = {
      query: {
        itemName: 'Item Only'
      }
    };

    const expectedQuery = { itemName: 'Item Only' };

    const mockItems = [{ itemName: 'Item Only' }];

    const findStub = sinon.stub(InventoryItem, 'find').resolves(mockItems);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getInventoryItemsByFields(req, res);

    expect(findStub.calledOnceWithExactly(expectedQuery)).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockItems)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const req = {
      query: {
        itemName: 'Broken'
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    const findStub = sinon.stub(InventoryItem, 'find').rejects(new Error('DB Error'));

    await getInventoryItemsByFields(req, res);

    expect(findStub.calledOnce).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});