const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(`${process.env.MONGODB_URI}`)
      .then(() => {
        console.log("Database connection established");
      })
      .catch((err) => {
        console.log(`Unable to connect to database ${err}`);
      });
  }
}

module.exports = new Database();
