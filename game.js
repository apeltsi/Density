// As we're using Density 2.0 we have to import all density modules that we wish to use manually.
import Density, { Vec2, math, mouseX, mouseY } from "./Density/Core.js";

import Cluster from "./Density/Clusters.js";
var pos = new Vec2(0, 0);
// Let's begin by initializing Density with
Density.init();
Density.draw(
  new Density.Drawable("rect", 0, 0, -50, 50, 100, 100, true, "", "red")
);
document.getElementById("loadingScreen").style.display = "none";

Density.registerResizeEvent(() => {
  console.log("YOO Resizing");
  document.getElementById("maincanvas").width = window.innerWidth;
  document.getElementById("maincanvas").height = window.innerHeight;
  Density.width = Density.canvas.width;
  Density.height = Density.canvas.height;
});

console.log(Density.drawablesQueue);

Density.doResize();
Density.registerUpdateEvent(() => {
  Density.moveDraw(0, pos);
  Density.changeDraw(
    1,
    new Density.Drawable("text", 1, 1, 0, 0, 100, 100, true, "center", {
      text: "X" + mouseX + " Y" + mouseY,
      color: "black",
      align: "center",
    })
  );
  pos = math.veclerp(
    pos,
    Density.localToGlobalPos(new Vec2(mouseX - 50, mouseY + 50)),
    0.1
  );
});
