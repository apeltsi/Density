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
  document.body.append(iframe);
  script.innerText = `
  var data = '${JSON.stringify(Debugger.data)}';
  function setUpDebugFrame() { 
    console.log(data);
    var frame = window.frames['DensityDebug'];
    frame.updateData(data);
  }`;
  document.body.append(script);
  setInterval(() => {
    script.parentElement.removeChild(script);
    script = document.createElement("script");
    document.body.append(script);

    script.innerText = `
    var data = '${JSON.stringify(Debugger.data)}';
    function setUpDebugFrame() { 
      console.log(data);
      var frame = window.frames['DensityDebug'];
      frame.updateData(data);
    }`;
  }, 500);
};
Debugger.openDebugScreen = (element) => {};
setInterval(Debugger.getLatestData, 500);

export default Debugger;
