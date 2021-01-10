var engineCore = {};
//#region Misc Library
// PAGE SETUP
window.onload = function () {
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );
  document.addEventListener(
    "keydown",
    function (e) {
      //document.onkeydown = function(e) {
      // "I" key
      /*if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
          disabledEvent(e);
      }*/
      // "J" key
      if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
        disabledEvent(e);
      }
      // "S" key + macOS
      if (
        e.keyCode == 83 &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        disabledEvent(e);
      }
      // "U" key
      if (e.ctrlKey && e.keyCode == 85) {
        disabledEvent(e);
      }
      // "F12" key
      if (event.keyCode == 123) {
        disabledEvent(e);
      }
    },
    false
  );

  function disabledEvent(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
    e.preventDefault();
    return false;
  }
};
// QUEUES

// User defined class
// to store element and its priority
class QElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

// PriorityQueue class
class PriorityQueue {
  // An array is used to implement priority

  constructor(items) {
    if (items == null) {
      this.items = [];
      this.length = 0;
    } else {
      this.items = [];
      for (var i = 0; i < items.length; i++) {
        this.enqueue(items[i]);
      }
      this.length = items.length;
    }
  }

  enqueue(element, priority) {
    var returnValue;
    // creating object from queue element
    var qElement = new QElement(element, priority);
    var contain = false;
    this.length++;
    // iterating through the entire
    // item array to add element at the
    // correct location of the Queue
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        // Once the correct location is found it is
        // enqueued
        this.items.splice(i, 0, qElement);
        contain = true;
        returnValue = i;
        break;
      }
    }

    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
      this.items.push(qElement);
      returnValue = this.items.length - 1;
    }
    return returnValue;
  }

  remove(id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].element.id == id) {
        this.items.splice(i, 1);
        this.length--;
      }
    }
  }

  getRaw(id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].element.id == id) {
        return this.items[i];
      }
    }
    return null;
  }

  changeRaw(id, newItem) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].element.id == id) {
        this.items[i].element = newItem;
        return true;
      }
    }
    return false;
  }

  dequeue() {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow

    if (this.isEmpty()) return null;
    this.length--;
    return this.items.shift();
  }

  front() {
    // returns the highest priority element
    // in the Priority queue without removing it.
    if (this.isEmpty()) return null;
    return this.items[0];
  }
  rear() {
    // returns the lowest priorty
    // element of the queue
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    // return true if the queue is empty.
    return this.items.length == 0;
  }

  printPQueue() {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
      str += this.items[i].element + " ";
    return str;
  }
}
//#endregion

//#region Math Library
export var math = {};
math.distance = function (avec, bvec) {
  var a = avec.x - bvec.x;
  var b = avec.y - bvec.y;

  return Math.sqrt(a * a + b * b);
};
math.OneDDistance = function (apos, bpos) {
  var a = apos - bpos;

  return Math.abs(a);
};
math.lerp = function (v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
};
math.veclerp = function (v0, v1, t) {
  return new Vec2(v0.x * (1 - t) + v1.x * t, v0.y * (1 - t) + v1.y * t);
};
math.clamp = function (value, min, max) {
  if (value > max) {
    value = max;
  }
  if (value < min) {
    value = min;
  }
  return value;
};

math.high = function (a, b) {
  if (a > b) {
    return a;
  }
  if (b > a) {
    return b;
  }
};

math.low = function (a, b) {
  if (b > a) {
    return a;
  }
  if (a > b) {
    return b;
  }
};

math.getBoundingBox = function (points, width) {
  if (points.length < 1) {
    return {
      width: width,
      height: width,
      center: new Vec2(0, 0),
    };
  }
  if (points.length < 2) {
    return {
      width: width,
      height: width,
      center: points[0],
    };
  }
  var boundingBox = {
    width: 0,
    height: 0,
    center: new Vec2(0, 0),
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  };
  var lowestY;
  var lowestX;
  var highestY;
  var highestX;
  for (let i = 0; i < points.length; i++) {
    const element = points[i];
    if (lowestX == undefined || element.x < lowestX) {
      lowestX = element.x;
    }
    if (lowestY == undefined || element.y < lowestY) {
      lowestY = element.y;
    }
    if (highestX == undefined || element.x > highestX) {
      highestX = element.x;
    }
    if (highestY == undefined || element.y > highestY) {
      highestY = element.y;
    }
  }
  boundingBox.width = highestX - lowestX + width;
  boundingBox.height = highestY - lowestY + width;
  boundingBox.minX = lowestX;
  boundingBox.minY = lowestY;
  boundingBox.maxX = highestX;
  boundingBox.maxY = highestY;
  boundingBox.center = new Vec2(
    Math.round(lowestX + boundingBox.width / 2),
    Math.round(lowestY + boundingBox.height / 2)
  );
  if (Number.isNaN(boundingBox.center.x)) {
    boundingBox.center = new Vec2(0, 0);
  }
  return boundingBox;
};
//#endregion
// THIS SCRIPT HANDLES THE RENDERING SYSTEM
var canvas = document.getElementById("maincanvas");
engineCore.canvas = canvas;
var c = canvas.getContext("2d");
export var engine_drawables = new PriorityQueue(); // DRAWABLES OR RENDER QUEUE
var updatefuncs = [];
var resizefuncs = [];
var idsInUse = [];
export var renderScale = 1;
var mouseIsOverCanvas = true;

var drawFuncs = []; // this array holds all of the draw funcs
export var stats = {
  lastFrameTime: 0,
  currentFrameTime: 0,
  frameCount: 0,
  startTime: 0,
  errors: [],
};
export var mouse = new Vec2(0, 0);
export var width = canvas.width;
export var height = canvas.height;
export var camPos = new Vec2(0, 0);
var mouseMoveEvent = function (event) {
  mouse.x = event.x;
  mouse.y = height - event.y;
  if (-event.y > 0) {
    mouseIsOverCanvas = false;
  } else {
    mouseIsOverCanvas = true;
  }
};
engineCore.init = function initialize() {
  requestAnimationFrame(frame);
  initializeFunctions();
  engineCore.doResize();
  window.addEventListener("mousemove", mouseMoveEvent);
  stats.startTime = Date.now();
};
engineCore.setRenderScale = (scale) => {
  renderScale = scale;
};
engineCore.moveCamera = function moveCamera(pos) {
  camPos = pos;
};
engineCore.localToGlobalPos = function localToGlobal(pos) {
  return new Vec2(
    (pos.x + camPos.x) * renderScale,
    (pos.y + camPos.y) * renderScale
  );
};
engineCore.localToGlobalX = function localToGlobalX(x) {
  return (x + camPos.x) / renderScale;
};
engineCore.localToGlobalY = function localToGlobalY(y) {
  return (y - camPos.y) / renderScale;
};

engineCore.draw = function draw(
  drawable = {
    type: "",
    id: engineCore.getDrawableID(),
    priority: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    global: true,
    args: {},
  }
) {
  // ADDS A DRAWABLE TO THE RENDER QUEUE
  if (drawable == undefined) {
    logError("ILLEGAL DRAWABLE");
    return undefined;
  }
  drawable.type = getDrawableTypeInteger(drawable.type);

  idsInUse[idsInUse.length] = drawable.id;
  const index = engine_drawables.enqueue(drawable, drawable.priority);
  return engine_drawables.items[index].element;
};

function getDrawableTypeInteger(typestring) {
  switch (typestring) {
    case "rect":
      return 1;
    case "sprite":
      return 2;
    case "text":
      return 3;
    case "line":
      return 4;
    case "circle":
      return 5;
    case "cluster":
      return 2;
    default:
      return 0;
  }
}

engineCore.removeDraw = function removeDraw(id) {
  engine_drawables.remove(id);
};

engineCore.changeDraw = function changeDraw(id, newDrawable) {
  // DOESN'T CHANGE PRIORITY ONLY ITEM CONTENTS UNLESS DRAW() IS CALLED
  var rawItem = engine_drawables.getRaw(id);
  if (rawItem == null || rawItem.element != newDrawable) {
    if (rawItem != null) {
      newDrawable.type = getDrawableTypeInteger(newDrawable.type);
      engine_drawables.changeRaw(id, newDrawable);
    } else {
      engineCore.draw(newDrawable);
    }
  }
};

engineCore.moveDraw = function moveDraw(id, pos) {
  var rawItem = engine_drawables.getRaw(id);
  if (rawItem == null || rawItem.element != newDrawable) {
    var newDrawable = rawItem.element;
    newDrawable.x = pos.x;
    newDrawable.y = pos.y;
    if (rawItem != null) {
      engine_drawables.changeRaw(id, newDrawable);
    } else {
      engineCore.draw(newDrawable);
    }
  }
};

engineCore.registerUpdateEvent = function registerUpdateEvent(func) {
  updatefuncs[updatefuncs.length] = func;
};
engineCore.getDrawableID = function getDrawableID() {
  var id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
  for (var i = 0; i < idsInUse.length; i++) {
    if (idsInUse[i] == id) {
      // THIS CHECK IS ACTUALLY VERY STUPID, BUT IS DONE FOR CONSISTENCY IN THE CODE(ALSO TO PREVENT MY ANXIETY)
      id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
    }
  }
  return id;
};

engineCore.getCamCenter = function getCamCenter() {
  return new Vec2(camPos.x, camPos.y);
};

function inRenderFrame(pos, w, h) {
  // Culling

  if (
    math.OneDDistance(pos.x, engineCore.getCamCenter().x) >
      (canvas.width / 2 + w) / renderScale ||
    math.OneDDistance(pos.y, engineCore.getCamCenter().y) >
      (canvas.height / 2 + h + height) / renderScale
  ) {
    return false;
  } else {
    return true;
  }
}

function frame() {
  // DRAWS A FRAME
  updatefuncs.forEach((func) => {
    func();
  });
  c.clearRect(0, 0, canvas.width, canvas.height);
  var drawablesQueue = new PriorityQueue(engine_drawables.items);
  var length = drawablesQueue.length;
  for (var i = 0; i < length; i++) {
    var item = drawablesQueue.dequeue().element.element;
    if (item.type == 0) {
      continue;
    }
    if (item == undefined) {
      logError("ILLEGAL DRAWABLE");
      requestAnimationFrame(frame);
      return;
    }
    if (item.type == 4) {
      item.x = (item.args.x1 + item.args.x2) / 2;
      item.y = (item.args.y1 + item.args.y2) / 2;
      item.w = Math.abs(item.args.x1 - item.args.x2);
      item.h = Math.abs(item.args.y1 - item.args.y2);
    }
    if (
      inRenderFrame(new Vec2(item.x, item.y), item.w, item.h) ||
      !item.global
    ) {
      var posModifierX = 0;
      var posModifierY = 0;
      var modifiedX = item.x;
      var modifiedY = item.y;
      var modifiedW = item.w;
      var modifiedH = item.h;
      if (item.global) {
        modifiedX =
          (item.x - camPos.x - posModifierX - item.w / 2) * renderScale +
          width / 2;
        modifiedY =
          (-item.y + camPos.y + posModifierY - item.h / 2) * renderScale +
          height / 2;
        modifiedW = item.w * renderScale;
        modifiedH = item.h * renderScale;
      } else {
        modifiedX = item.x - posModifierX;
        modifiedY = -item.y + posModifierY;
      }
      c.globalAlpha = item.transparency;
      drawFuncs[item.type - 1](
        item,
        modifiedX,
        modifiedY,
        modifiedW,
        modifiedH,
        c,
        posModifierX,
        posModifierY
      );
    }
  }
  stats.currentFrameTime = Date.now() - stats.lastFrameTime;
  stats.lastFrameTime = Date.now();
  stats.frameCount++;
  requestAnimationFrame(frame);
}

export function Vec2(x, y) {
  if (y == undefined) {
    this.x = x;
    this.y = x;
  } else {
    this.x = x;
    this.y = y;
  }

  this.addV = function (vec_) {
    return new Vec2(this.x + vec_.x, this.y + vec_.y);
  };
  this.subV = function (vec_) {
    return new Vec2(this.x - vec_.x, this.y - vec_.y);
  };
  this.dot = function (vec_) {
    return this.x * vec_.x + this.y * vec_.y;
  };
  this.length = function () {
    return Math.sqrt(this.dot(this));
  };
  this.divS = function (value) {
    return new Vec2(this.x / value, this.y / value);
  };
  this.mulV = function (vec_) {
    return new Vec2(this.x * vec_.x, this.y * vec_.y);
  };
  this.mulS = function (value) {
    return new Vec2(this.x * value, this.y * value);
  };
  this.clamp = function (min, max) {
    var x = this.x;
    var y = this.y;
    if (this.x > max) {
      x = max;
    } else if (this.x < min) {
      x = min;
    }
    if (this.y > max) {
      y = max;
    } else if (this.y < min) {
      y = min;
    }
    return new Vec2(x, y);
  };
}

function initializeFunctions() {
  // Draw funcs. NOTE: Some density plugins like Density-Particles will add the function on their own!

  drawFuncs.push((item, modifiedX, modifiedY, modifiedW, modifiedH, ctx) => {
    // RECT
    ctx.translate(modifiedX, modifiedY);
    //ctx.rotate(1);
    ctx.beginPath();
    ctx.rect(0, 0, modifiedW, modifiedH);
    ctx.fillStyle = item.args;
    ctx.fill();
    //ctx.rotate(-1);
    ctx.translate(-modifiedX, -modifiedY);
  });

  drawFuncs.push((item, modifiedX, modifiedY, modifiedW, modifiedH, ctx) => {
    // SPRITE
    ctx.drawImage(item.args, modifiedX, modifiedY, modifiedW, modifiedH);
  });

  drawFuncs.push((item, modifiedX, modifiedY, modifiedW, modifiedH, ctx) => {
    // TEXT
    var scale = 1;
    if (item.global) {
      scale = renderScale;
    }
    ctx.font = "bold " + 30 * scale + "px Arial";
    ctx.textAlign = item.args.align;
    ctx.textBaseline = "middle";
    ctx.fillStyle = item.args.color;
    ctx.fillText(item.args.text, modifiedX, modifiedY);
  });

  drawFuncs.push(
    (
      item,
      modifiedX,
      modifiedY,
      modifiedW,
      modifiedH,
      ctx,
      posModifierX,
      posModifierY
    ) => {
      // LINE
      var lineX1;
      var lineY1;
      var lineX2;
      var lineY2;
      if (item.global) {
        lineX1 = (item.args.x1 - camPos.x - posModifierX) * renderScale;
        lineY1 = (-item.args.y1 + camPos.y - posModifierY) * renderScale;
        lineX2 = (item.args.x2 - camPos.x - posModifierX) * renderScale;
        lineY2 = (-item.args.y2 + camPos.y - posModifierY) * renderScale;
        modifiedW = item.w * renderScale;
        modifiedH = item.h * renderScale;
      }
      ctx.strokeStyle = item.args.color;
      ctx.beginPath();
      ctx.moveTo(lineX1, lineY1);
      ctx.lineTo(lineX2, lineY2);
      ctx.closePath();
      ctx.lineWidth = item.args.width * renderScale;
      ctx.stroke();
    }
  );

  drawFuncs.push((item, modifiedX, modifiedY, modifiedW, modifiedH, ctx) => {
    // SPRITE
    ctx.beginPath();
    ctx.arc(modifiedX, modifiedY, modifiedW, 0, 2 * Math.PI);
    ctx.fillStyle = item.args;
    ctx.fill();
  });
}

resizefuncs.push(() => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
});

engineCore.registerResizeEvent = function (func) {
  resizefuncs.push(func);
};
engineCore.doResize = () => {
  for (let i = 0; i < resizefuncs.length; i++) {
    const element = resizefuncs[i];
    element();
  }
};

function logError(str) {
  console.logError(str);
  stats.errors.push(str);
}

/* Simple Resize Check */
window.onresize = engineCore.doResize;

export default engineCore;
