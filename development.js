const child_process = require("child_process");
const portfinder = require("portfinder");
startServer();
async function startServer() {
  var port = await portfinder.getPortPromise();

  var child = child_process.exec("node devServer.js " + port + " dev");
  child.stdout.on("data", function (data) {
    if (data.includes("Now listening on")) {
      console.log(
        "Development server launched at " + data.split("Now listening on ")[1]
      );
    } else {
      console.log("SERVER: " + data);
    }
  });
  child.stderr.on("data", function (data) {
    console.log("\x1b[31mERROR\x1b[0m: SERVER" + port + ": " + data);
  });
  child.on("exit", () => {
    process.exit(0);
  });
  childProcess = child;
}
process.on("SIGINT", function () {
  console.log("\n");
  console.log("\x1b[31mExiting...\x1b[0m");
  if (childProcess != undefined) {
    console.log("Shutting down development server...");
    childProcess.kill();
  }
  console.log("Thank you and goodbye!");
  process.exit();
});

process.on("beforeExit", () => {});
