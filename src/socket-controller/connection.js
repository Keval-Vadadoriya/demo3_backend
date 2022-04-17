const setId = require("./setId");
const getchats = require("./getchats");
const addtochatlist = require("./addtochatlist");
const getchatlist = require("./getchatlist");
const message = require("./message");
const delivered = require("./delivered");
const obj = require("./users");

const connection = (socket) => {
  let userId;
  socket.on("setId", setId.bind(null, socket));

  //getchats
  socket.on("getchats", getchats.bind(null, socket));

  //addToChatList
  socket.on("addToChatList", addtochatlist.bind(null, socket));

  //get chat list
  socket.on("getchatlist", getchatlist.bind(null, socket));

  //message
  socket.on("message", message.bind(null, socket));

  //Delivered
  socket.on("delivered", delivered.bind(null, socket));

  //seen

  socket.on("disconnect", () => {
    delete obj[userId];
  });
};

module.exports = connection;
