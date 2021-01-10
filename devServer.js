var args = process.argv.slice(2);
const express = require("express");
const open = require("open");

const app = express();
const port = parseInt(args[0]);
const development = args[1];
if (port == undefined) {
  process.exit(1);
}
if (development != "dev") {
  app.use(express.static("build"));
} else {
  app.use(express.static("src"));
}
app.listen(port, () => {
  console.log("Now listening on " + port);
  open("http://localhost:" + port + "/index.html");
});
