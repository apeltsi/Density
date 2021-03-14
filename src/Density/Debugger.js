// Density Debugger
import Density, { engine_drawables, stats } from "./Core.js";
var Debugger = {};
var script = document.createElement("script");

Debugger.data = { avgfps: 0 };
Debugger.getLatestData = () => {
  Debugger.data = {
    fps: Math.round(1000 / stats.currentFrameTime),
    avgfps: Math.round(
      1000 / ((Date.now() - stats.startTime) / stats.frameCount)
    ),
    frames: stats.frameCount,
    drawablecount: engine_drawables.items.length,
    errorCount: stats.errors.length,
    runTime: Date.now() - stats.startTime,
    version: stats.ver,
  };
};
Debugger.setUpDebugger = () => {
  const iframe = document.createElement("iframe");
  iframe.src = "./Density/Debug.html";
  iframe.name = "DensityDebug";
  iframe.style.position = "absolute";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.zIndex = "999";
  iframe.id = "debuggeriframe";
  document.body.append(iframe);
  script.innerText = `
  var data = '${JSON.stringify(Debugger.data)}';
  function setUpDebugFrame() { 
    var frame = window.frames['DensityDebug'];
    frame.updateData(data);
  }`;
  iframe.addEventListener("load", () => {
    iframe.contentWindow.document.getElementsByTagName("form")[0].onsubmit = (
      e
    ) => {
      e.preventDefault();
      dispatchCommand(
        iframe.contentWindow.document.getElementById("commandInput").value
      );
      iframe.contentWindow.document.getElementById("commandInput").value = "";
    };
  });

  document.body.append(script);
  setInterval(() => {
    script.parentElement.removeChild(script);
    script = document.createElement("script");
    document.body.append(script);

    script.innerText = `
    var data = '${JSON.stringify(Debugger.data)}';
    function setUpDebugFrame() { 
      var frame = window.frames['DensityDebug'];
      frame.updateData(data);
    }`;
  }, 250);
};
Debugger.openDebugScreen = (element) => {};
setInterval(Debugger.getLatestData, 250);

function dispatchCommand(cmd) {
  var splitcmd = cmd.split(" ");
  switch (splitcmd[0]) {
    case "ping":
      console.log("pong");
      break;
    case "engine":
      console.log(
        "%cPowered By:",
        "color: white; background: black; font-size: 24px"
      );
      console.log(
        "%cDensity Engine",
        "color: white; background: black; font-size: 34px"
      );
      console.log(
        "You're currently running Density Engine Version " +
          Debugger.data.version
      );
      break;
    case "performance":
      console.log("Performance data:");
      console.log(Debugger.data);
      break;
    case "set":
      switch (splitcmd[1]) {
        case "renderscale":
          Density.setRenderScale(splitcmd[2]);
          console.log("New renderScale of " + splitcmd[2]);
          break;
        case "debugger":
          break;
      }
      break;
    case "game":
      document.dispatchEvent(
        new CustomEvent("debugger-command-game", { detail: splitcmd })
      );
  }
}

export default Debugger;
