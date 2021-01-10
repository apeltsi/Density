console.log("Starting Density Builder...");
const minify = require("minify");
const child_process = require("child_process");
const portfinder = require("portfinder");
const fs = require("fs");
const path = require("path");
const startTime = Date.now();
const settings = require("./src/density.json");
var childProcess;
var runArgs = {};
for (let i = 2; i < process.argv.length; i++) {
  const element = process.argv[i];
  if (element == "buildandrun" || element == "br" || element == "run") {
    runArgs.buildAndRun = true;
  }
}
const options = {
  html: {
    removeAttributeQuotes: false,
    removeOptionalTags: false,
  },
};
var walkSync = function (dir) {
  if (dir.includes(".git")) {
    return;
  }
  if (dir[dir.length - 1] != "/") dir = dir.concat("/");

  var fs = fs || require("fs"),
    files = fs.readdirSync(dir);
  files.forEach(function (file) {
    if (fs.statSync(dir + file).isDirectory()) {
      fs.mkdirSync(
        __dirname +
          "/build" +
          (dir + file).substring(
            (__dirname + "/src").length,
            (dir + file).length
          )
      );
      walkSync(dir + file + "/");
    } else if (file != "density.json" && file != ".gitignore") {
      fs.copyFileSync(
        dir + file,
        __dirname +
          "/build" +
          (dir + file).substring(
            (__dirname + "/src").length,
            (dir + file).length
          )
      );
      if (settings.buildSettings.minify) {
        // CHECK IF FILE SHOULD BE MINIFIED
        const type = file.split(".")[file.split(".").length - 1];
        if (type == "js" || type == "html" || type == "htm" || type == "css") {
          // MINIFY
          minify(dir + file, options)
            .then(async (min) => {
              fs.writeFile(
                __dirname +
                  "/build" +
                  (dir + file).substring(
                    (__dirname + "/src").length,
                    (dir + file).length
                  ),
                min,
                (err) => {}
              );
            })
            .catch(console.error);
        }
      }
    }
  });
};
var dir = __dirname + "/build";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, 0744);

  build();
} else {
  fs.rmdirSync(dir, { recursive: true });
  fs.mkdirSync(dir, 0744);

  build();
}

async function build() {
  var dir = __dirname + "/src";
  console.log("Building Project...");
  walkSync(dir);
  console.log(
    "\x1b[32mYour Project has been built. ( " +
      (Date.now() - startTime) +
      "ms! )\x1b[0m"
  );
  if (runArgs.buildAndRun == true) {
    startServer();
  }
  //__dirname + "/build" + fromPath.substring(dir.length, fromPath.length)
}

async function startServer() {
  var port = await portfinder.getPortPromise();

  var child = child_process.exec("node devServer.js " + port);
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
