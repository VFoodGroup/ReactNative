const mongoose = require("mongoose");

function dbConnect() {
  const dbURI = "mongodb+srv://Admin:Admin123456@cluster0.p39wp.mongodb.net/VFood?retryWrites=true&w=majority&appName=Cluster0";
  mongoose
    .connect(dbURI)
    .then(() => console.log("Connected to database"))
    .catch((error) => console.log("Database connection error:", error));
}

module.exports = dbConnect;