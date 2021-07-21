const { MongoClient, ObjectId } = require("mongodb");

class DataStore {
  constructor(dbUrl, dbName, collName) {
    this.dbUrl = dbUrl;
    this.dbName = dbName;
    this.collName = collName;
    this.dbClient = null;
  }

  async client() {
    //console.log(this.dbClient)
    console.log(`Connecting to ${this.dbUrl}...`);
    this.dbClient = await MongoClient.connect(this.dbUrl, {
      useNewUrlParser: true,
    });
    console.log("connected to database");
    return this.dbClient;
  }

  close() {
    this.dbClient.close();
    this.dbClient = null;
  }

  async collection() {
    const client = await this.client();
    const db = client.db(this.dbName);
    const collection = db.collection(this.collName);
    return collection;
  }

  async all() {
    let collection = await this.collection();
    let newColl = collection.find({});

    return newColl;
  }

  async find(query) {
    let collection = await this.collection();
    let newColl = collection.find(query);

    return newColl;
  }

  async addEntry(entry) {
    let collection = await this.collection();
    let newEntry = await collection.insertOne(entry);

    return newEntry.insertedId;
  }

  async findOne(id) {
    let collection = await this.collection();
    let newId = await ObjectId(id);
    let newColl = collection.find({ _id: newId });
    return newColl;
  }

  async updateOne(id, updateObj) {
    let collection = await this.collection();
    await collection.updateOne({ _id: ObjectId(id) }, updateObj);
  }
}

module.exports = DataStore;
