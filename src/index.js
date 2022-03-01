const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router/Router");
const port = process.env.port || 3001;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});
