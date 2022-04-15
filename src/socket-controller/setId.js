const obj = require("./users");
const setId = (socket, id) => {
  // userId = id;
  obj[id] = socket.id;
};
module.exports = setId;
