const obj = require("./users");
const setId = (socket, id) => {
  obj[id] = socket.id;
  console.log("setId",obj)
};
module.exports = setId;
