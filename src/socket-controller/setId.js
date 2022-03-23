const obj = require("./users");
const setId = (socket, id) => {
  userId = id;
  console.log("is", userId);
  obj[id] = socket.id;
  console.log("fdf", obj[userId], obj);
};
module.exports = setId;
