import Density, {
  Vec2,
  math,
  mouse,
  renderScale,
  Drawable,
  Rectangle,
} from "./Density/Core.js";
import assets from "./Density/Assets.js";
import Cluster from "./Density/Clusters.js";
import Debugger from "./Density/Debugger.js";
// Let's begin by initializing Density with
var targetZoom = 1;
Density.setRenderScale(100);
Density.init();
let test = Density.draw(
  new Rectangle({
    pos: new Vec2(0, 0),
    scale: new Vec2(50),
    global: true,
    color: "red",
  })
);
console.log(test);

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
Debugger.setUpDebugger();
