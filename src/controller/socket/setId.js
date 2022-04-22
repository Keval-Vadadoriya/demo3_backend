const obj = require("./users");
const setId = (socket, id) => {
  obj[id] = socket.id;
};
module.exports = setId;
