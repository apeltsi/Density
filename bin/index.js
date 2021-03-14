#!/usr/bin/env node
const minify = require("minify");
const child_process = require("child_process");
const portfinder = require("portfinder");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
var startTime = Date.now();
const settings = require(process.cwd() + "/src/density.json");
console.log("Starting Density Builder...");
var childProcess;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
var runArgs = {};
console.log("Watching folder " + path.join(process.cwd() + "/src"));
chokidar.watch(path.join(process.cwd() + "/src")).on("all", (event, path) => {
  if (Date.now() - startTime > 500) {
    runArgs.buildAndRun = false;
    startTime = Date.now();
    runBuild();
  }
});
rl.on("line", function (input) {
  if (input == "r" || input == "reload") {
    runArgs.buildAndRun = false;
    startTime = Date.now();
    runBuild();
  }
});
for (let i = 2; i < process.argv.length; i++) {
  const element = process.argv[i];
  if (element == "buildandrun" || element == "br" || element == "run") {
    runArgs.buildAndRun = true;
  } else if (element == "dev" || element == "d") {
    runArgs.dev = true;
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
        process.cwd() +
          "/build" +
          (dir + file).substring(
            (process.cwd() + "/src").length,
            (dir + file).length
          )
      );
      walkSync(dir + file + "/");
    } else if (file != "density.json" && file != ".gitignore") {
      fs.copyFileSync(
        dir + file,
        process.cwd() +
          "/build" +
          (dir + file).substring(
            (process.cwd() + "/src").length,
            (dir + file).length
          )
      );
      if (settings.buildSettings.minify) {
        // CHECK IF FILE SHOULD BE MINIFIED
        const type = file.split(".")[file.split(".").length - 1];
        if (type == "js" || type == "html" || type == "htm" || type == "css") {
          // MINIFY
          const t = new Date();
          const date = ("0" + t.getDate()).slice(-2);
          const month = ("0" + (t.getMonth() + 1)).slice(-2);
          const year = t.getFullYear();
          const hours = ("0" + t.getHours()).slice(-2);
          const minutes = ("0" + t.getMinutes()).slice(-2);
          const seconds = ("0" + t.getSeconds()).slice(-2);
          const time = `${date}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
          minify(dir + file, options)
            .then(async (min) => {
              fs.writeFile(
                process.cwd() +
                  "/build" +
                  (dir + file).substring(
                    (process.cwd() + "/src").length,
                    (dir + file).length
                  ),
                min
                  .replace(/BUILD_DATE/g, time)
                  .replace(/BUILD_NUMBER/g, settings.buildNumber),
                (err) => {}
              );
            })
            .catch(console.error);
        }
      }
    }
  });
};
runBuild();
function runBuild() {
  if (settings.buildNumber == undefined) {
    settings.buildNumber = 0;
  }
  settings.buildNumber += 1;
  fs.writeFile(
    process.cwd() + "/src/density.json",
    JSON.stringify(settings),
    () => {}
  );
  if (runArgs.dev == true) {
    // Dev mode
    var dir = process.cwd() + "/tmp";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, 0744);

      build();
    } else {
      fs.rmdirSync(dir, { recursive: true });
      fs.mkdirSync(dir, 0744);

      build();
    }
  } else {
    var dir = process.cwd() + "/build";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, 0744);

      build();
    } else {
      fs.rmdirSync(dir, { recursive: true });
      fs.mkdirSync(dir, 0744);

      build();
    }
  }
}
async function build() {
  var dir = process.cwd() + "/src";
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

  var child = child_process.exec(
    "node " + path.join(__dirname + "/../devServer.js") + " " + port
  );
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
