// This is the cluster renderer module for Density.

export default function Cluster(clusterDrawables, priority, pos, size) {
  this.drawables = clusterDrawables; // Run new PriorityQueue() to create an empty priority queue
  this.pos = pos;
  this.size = size;
  this.priority = priority;
  this.render = renderCluster(this);
}

function renderCluster(cluster) {
  var clustercanvas = document.getElementById("clustercanvas");
  var clusterc = clustercanvas.getContext("2d");
  clusterc.clearRect(0, 0, canvas.width, canvas.height);
  var drawablesQueue = new PriorityQueue(cluster.drawables.items);
  clustercanvas.width = cluster.size.x;
  clustercanvas.height = cluster.size.y;
  var length = drawablesQueue.length;
  for (var i = 0; i < length; i++) {
    var item = drawablesQueue.dequeue().element.element;
    if (item == undefined) {
      console.log("ILLEGAL DRAWABLE");
      return undefined;
    }
    if (item.type == 3) {
      item.x = (item.args.x1 + item.args.x2) / 2;
      item.y = (item.args.y1 + item.args.y2) / 2;
      item.w = Math.abs(item.args.x1 - item.args.x2);
      item.h = Math.abs(item.args.y1 - item.args.y2);
    }
    if (
      inRenderFrame(new Vec2(item.x, item.y), item.w, item.h, item.anchor) ||
      !item.global
    ) {
      var posModifierX = 0;
      var posModifierY = 0;
      var modifiedX = item.x;
      var modifiedY = item.y;
      var modifiedW = item.w;
      var modifiedH = item.h;
      if (item.anchor == "center") {
        posModifierX = -Math.round(canvas.width / 2) / renderScale;
        posModifierY = -Math.round(canvas.height / 2) / renderScale;
      }
      if (item.global) {
        modifiedX = (item.x - engineCore.camPos.x - posModifierX) * renderScale;
        modifiedY =
          (-item.y + engineCore.camPos.y - posModifierY) * renderScale;
        modifiedW = item.w * renderScale;
        modifiedH = item.h * renderScale;
      } else {
        modifiedX = item.x - posModifierX;
        modifiedY = -item.y - posModifierY;
      }
      clusterc.globalAlpha = item.transparency;
      drawFuncs[item.type](
        item,
        modifiedX,
        modifiedY,
        modifiedW,
        modifiedH,
        clusterc,
        posModifierX,
        posModifierY
      );
    }
  }
  var imageElement = document.createElement("IMG");
  imageElement.src = clustercanvas.toDataURL();
  imageElement.id = Math.random() * Number.MAX_SAFE_INTEGER;
  document.body.appendChild(imageElement);
  return new Drawable(
    "cluster",
    cluster.priority,
    engineCore.getDrawableID(),
    cluster.pos.x,
    cluster.pos.y,
    cluster.size.x,
    cluster.size.y,
    "true",
    "center",
    imageElement
  );
}
