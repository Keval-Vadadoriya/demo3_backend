const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/demo3-api", {
  useNewUrlparser: true,
});

module.exports = mongoose;
