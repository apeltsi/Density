// As we're using Density 2.0 we have to import all density modules that we wish to use manually.
import Density, { Vec2, math, mouse, renderScale } from "./Density/Core.js";
import assets from "./Density/Assets.js";
import Cluster from "./Density/Clusters.js";
// Let's begin by initializing Density with
var targetZoom = 1;
Density.setRenderScale(100);

Density.init();
let test = Density.draw();
console.log(test);
test.x = 0;
test.y = 0;
test.type = 1;
test.w = 100;
test.h = 100;
test.global = true;
test.args = "red";

document.getElementById("loadingScreen").style.display = "none";
Density.registerUpdateEvent(() => {
  /*Density.moveDraw(
    0,
    Density.localToGlobalPos(new Vec2(mouse.x - 10, mouse.y + 10))
  );*/
  if (math.OneDDistance(renderScale, targetZoom) > 0.001) {
    Density.setRenderScale(math.lerp(renderScale, targetZoom, 0.05));
  }
});
