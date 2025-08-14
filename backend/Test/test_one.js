
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Inventory = require('../models/inventory');
const { updateInventory,getInventory,addInventory,deleteInventory } = require('../controllers/inventoryController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

//getInventory, addInventory, updateInventory, deleteInventory
describe('AddInventory Function Test', () => {

  it('should create a new inventory successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Inventory", description: "Inventory description", deadline: "2025-12-31" }
    };

    // Mock inventory that would be created
    const createdInventory = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Inventory.create to return the createdInventory
    const createStub = sinon.stub(Inventory, 'create').resolves(createdInventory);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addInventory(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdInventory)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Inventory.create to throw an error
    const createStub = sinon.stub(Inventory, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Inventory", description: "Inventory description", deadline: "2025-12-31" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addInventory(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update inventory successfully', async () => {
    // Mock inventory data
    const inventoryId = new mongoose.Types.ObjectId();
    const existingInventory = {
      _id: inventoryId,
      title: "Old Inventory",
      description: "Old Description",
      completed: false,
      deadline: new Date(),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Inventory.findById to return mock inventory
    const findByIdStub = sinon.stub(Inventory, 'findById').resolves(existingInventory);

    // Mock request & response
    const req = {
      params: { id: inventoryId },
      body: { title: "New Inventory", completed: true }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateInventory(req, res);

    // Assertions
    expect(existingInventory.title).to.equal("New Inventory");
    expect(existingInventory.completed).to.equal(true);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if inventory is not found', async () => {
    const findByIdStub = sinon.stub(Inventory, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateInventory(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Inventory not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Inventory, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateInventory(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetInventory Function Test', () => {

  it('should return inventries for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock inventory data
    const inventries = [
      { _id: new mongoose.Types.ObjectId(), title: "Inventory 1", userId },
      { _id: new mongoose.Types.ObjectId(), title: "Inventory 2", userId }
    ];

    // Stub Inventory.find to return mock inventries
    const findStub = sinon.stub(Inventory, 'find').resolves(inventries);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getInventory(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(inventries)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Inventory.find to throw an error
    const findStub = sinon.stub(Inventory, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getInventory(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteInventory Function Test', () => {

  it('should delete a inventory successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock inventory found in the database
    const inventory = { remove: sinon.stub().resolves() };

    // Stub Inventory.findById to return the mock inventory
    const findByIdStub = sinon.stub(Inventory, 'findById').resolves(inventory);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteInventory(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(inventory.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Inventory deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if inventory is not found', async () => {
    // Stub Inventory.findById to return null
    const findByIdStub = sinon.stub(Inventory, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteInventory(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Inventory not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Inventory.findById to throw an error
    const findByIdStub = sinon.stub(Inventory, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteInventory(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});