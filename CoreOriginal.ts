import { PriorityQueue, QElement } from "./PriorityQueue";
import math, { Vec2 } from "./Math";
export { math, Vec2 };
// THIS SCRIPT HANDLES THE RENDERING SYSTEM
let canvas: HTMLCanvasElement;
let c: CanvasRenderingContext2D;
export let engine_entities = new PriorityQueue(); // ENTITIES OR RENDER QUEUE
let updatefuncs: (() => void)[] = [];
let resizefuncs: (() => void)[] = [];
let idsInUse: any[] = [];
export let renderScale = 1;
let doCulling = true;
let mouseIsOverCanvas = true;
window.onerror = function (error: any, url: any, line: any) {
  logError(error);
  return false;
};
export interface EntityProps {
  id: any;
  priority: number;
  pos: Vec2;
  scale: Vec2;
  global: boolean;
  visible: boolean;
  parallax: Vec2;
  opacity: number;
}
export class Entity {
  id: any;
  priority: number;
  pos: Vec2;
  scale: Vec2;
  global: boolean;
  visible: boolean;
  parallax: Vec2;
  opacity: number;

  constructor(args: EntityProps) {
    Object.assign(this, args);
    if (this.id == undefined) {
      this.id = engineCore.getEntityID();
    }
    if (this.priority == undefined) {
      this.priority = 0;
    }
    if (this.global == undefined) {
      this.global = true;
    }
    if (this.visible == undefined) {
      this.visible = true;
    }
    if (this.parallax == undefined) {
      this.parallax = new Vec2(1, 1);
    }
    if (this.opacity == undefined) {
      this.opacity = 1;
    }
  }
  remove() {
    engineCore.removeDraw(this.id);
  }
}

interface Stats {
  lastFrameTime: number;
  currentFrameTime: number;
  frameCount: number;
  startTime: number;
  errors: any[];
  ver: String;
}
export let stats: Stats = {
  lastFrameTime: 0,
  currentFrameTime: 0,
  frameCount: 0,
  startTime: 0,
  errors: [],
  ver: "3.0",
};
export let mouse = new Vec2(0, 0);
export let width: number;
export let height: number;
export let camPos = new Vec2(0, 0);
let canvasOffset: Vec2 = new Vec2(0, 0);
let mouseMoveEvent = function (event: MouseEvent) {
  mouse.x = event.x - canvasOffset.x;
  mouse.y = height - (event.y - canvasOffset.y);
  if (-event.y > 0) {
    mouseIsOverCanvas = false;
  } else {
    mouseIsOverCanvas = true;
  }
};

function inRenderFrame(pos: Vec2, w: number, h: number) {
  // Culling
  if (!doCulling) {
    return true;
  }
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
  updatefuncs.forEach((func: () => void) => {
    func();
  });
  c.clearRect(0, 0, canvas.width, canvas.height);
  let entitiesQueue = new PriorityQueue(engine_entities.items);
  let length = entitiesQueue.length;
  for (let i = 0; i < length; i++) {
    let item = entitiesQueue.dequeue().element.element;
    if (item == undefined) {
      logError("ILLEGAL ENTITY");
      requestAnimationFrame(frame);
      return;
    }
    if (!item.visible) {
      continue;
    }
    if (inRenderFrame(item.pos, item.scale.x, item.scale.y) || !item.global) {
      let posModifierX = 0;
      let posModifierY = 0;
      let modifiedX = item.pos.x;
      let modifiedY = item.pos.y;
      let modifiedW = item.scale.x;
      let modifiedH = item.scale.y;
      if (item.global) {
        modifiedX =
          (item.pos.x - camPos.x - posModifierX - item.scale.x / 2) *
            renderScale *
            item.parallax.x +
          width / 2;
        modifiedY =
          (-item.pos.y + camPos.y + posModifierY - item.scale.y / 2) *
            renderScale *
            item.parallax.y +
          height / 2;
        modifiedW = item.scale.x * renderScale;
        modifiedH = item.scale.y * renderScale;
      } else {
        modifiedX = item.pos.x - posModifierX;
        modifiedY = -item.pos.y + posModifierY;
      }
      c.globalAlpha = item.opacity;
      c.translate(modifiedX, modifiedY);
      item.render(item, modifiedW, modifiedH, c);
      c.translate(-modifiedX, -modifiedY);

      c.globalAlpha = 1;
    }
  }
  stats.currentFrameTime = Date.now() - stats.lastFrameTime;
  stats.lastFrameTime = Date.now();
  stats.frameCount++;
  requestAnimationFrame(frame);
}
export interface Outline {
  color: string;
  width: number;
}

export interface RectangleProps extends EntityProps {
  color: string;
  stroke: Outline;
}
export class Rectangle extends Entity {
  color: string;
  stroke: Outline;
  constructor(args: RectangleProps) {
    super(args);
    this.color = args.color;
    this.stroke = args.stroke;
  }
  render(
    item: Rectangle,
    modifiedW: number,
    modifiedH: number,
    ctx: CanvasRenderingContext2D
  ) {
    //ctx.rotate(1);
    ctx.beginPath();
    ctx.rect(0, 0, modifiedW, modifiedH);
    ctx.fillStyle = item.color;

    ctx.fill();
    if (item.stroke) {
      ctx.strokeStyle = item.stroke.color;
      ctx.lineWidth = item.stroke.width * renderScale;
      ctx.stroke();
    }
    //ctx.rotate(-1);
  }
}

export interface SpriteProps extends EntityProps {
  image: CanvasImageSource;
}
export class Sprite extends Entity {
  image: CanvasImageSource;
  constructor(args: SpriteProps) {
    super(args);
    this.image = args.image;
  }
  render(
    item: Sprite,
    modifiedW: number,
    modifiedH: number,
    ctx: CanvasRenderingContext2D
  ) {
    if (item.image == undefined) {
      return;
    }
    ctx.drawImage(item.image, 0, 0, modifiedW, modifiedH);
  }
}

export interface TextProps extends EntityProps {
  text: string;
  color: string;
  font: string;
  align: CanvasTextAlign;
  outline: Outline;
}
export class Text extends Entity {
  text: string;
  color: string;
  font: string;
  align: CanvasTextAlign;
  outline: Outline;
  constructor(args: TextProps) {
    super(args);
    this.text = args.text;
    this.color = args.color;
    this.font = args.font;
    this.align = args.align;
    this.outline = args.outline;
  }
  render(
    item: Text,
    modifiedW: number,
    modifiedH: number,
    ctx: CanvasRenderingContext2D
  ) {
    let scale = 1;
    if (item.global) {
      scale = renderScale;
    }
    if (item.font != undefined) {
      ctx.font = item.font;
    } else {
      ctx.font = "bold " + 30 * scale + "px Arial";
    }
    ctx.textAlign = item.align;
    ctx.textBaseline = "middle";
    if (item.outline != undefined) {
      ctx.fillStyle = item.outline.color;
      ctx.lineWidth = item.outline.width * scale;
      ctx.strokeText(item.text, 0, 0);
    }
    ctx.fillStyle = item.color;

    ctx.fillText(item.text, 0, 0);
  }
}

export interface CircleProps extends EntityProps {
  color: string;
}
export class Circle extends Entity {
  color: string;
  constructor(args: TextProps) {
    super(args);
    this.color = args.color;
  }
  render(
    item: Circle,
    modifiedW: number,
    modifiedH: number,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.beginPath();
    ctx.arc(0, 0, modifiedW, 0, 2 * Math.PI);
    ctx.fillStyle = item.color;
    ctx.fill();
  }
}

resizefuncs.push(function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  width = canvas.width;
  height = canvas.height;
  canvasOffset = new Vec2(
    canvas.getBoundingClientRect().left,
    canvas.getBoundingClientRect().top
  );
});

function logError(str: String) {
  console.error(str);
  stats.errors.push(str);
}

/* Simple Resize Check */
export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
interface settings {
  doCulling: boolean;
}
const engineCore = {
  canvas: canvas,
  ctx: c,
  init: function initialize(settings = { doCulling: true }) {
    doCulling = settings.doCulling;
    if (document.getElementsByTagName("canvas").length == 0) {
      canvas = document.createElement("canvas");
      canvas.style.minHeight = "1px";
      canvas.style.minWidth = "1px";

      document.body.appendChild(canvas);
      engineCore.canvas = canvas;
      c = canvas.getContext("2d");
      console.log(
        "Density couldn't find a canvas. Creating and appending a new one."
      );
    }
    requestAnimationFrame(frame);
    engineCore.doResize();
    canvas.addEventListener("mousemove", mouseMoveEvent);
    stats.startTime = Date.now();
  },
  setRenderScale: (scale: number) => {
    renderScale = scale;
  },
  moveCamera: function moveCamera(pos: Vec2) {
    camPos = pos;
  },
  localToGlobalPos: function localToGlobal(pos: Vec2) {
    return new Vec2(
      (pos.x + camPos.x - width / 2) / renderScale,
      (pos.y + camPos.y - height / 2) / renderScale
    );
  },
  draw: function draw(
    entity: Entity = new Rectangle(<RectangleProps>{
      pos: new Vec2(0, 0),
      scale: new Vec2(100, 100),
      global: true,
      color: "",
      visible: true,
    })
  ) {
    if (entity == undefined) {
      logError("ILLEGAL ENTITY");
      return undefined;
    }

    idsInUse[idsInUse.length] = entity.id;
    const index = engine_entities.enqueue(entity, entity.priority);
    return engine_entities.items[index].element;
  },
  removeDraw: function removeDraw(id: number) {
    engine_entities.remove(id);
  },
  changeDraw: function changeDraw(id: any, newEntity: Entity) {
    // REPLACES THE DRAWABLE
    engineCore.removeDraw(id);
    return engineCore.draw(newEntity);
  },
  getEntityID: function getEntityID() {
    let id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
    for (let i = 0; i < idsInUse.length; i++) {
      if (idsInUse[i] == id) {
        // THIS CHECK IS ACTUALLY VERY STUPID, BUT IS DONE FOR CONSISTENCY IN THE CODE(ALSO TO PREVENT MY ANXIETY)
        id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
      }
    }
    return id;
  },
  getCamCenter: function getCamCenter() {
    return new Vec2(camPos.x, camPos.y);
  },
  registerUpdateEvent: function registerUpdateEvent(func: () => void) {
    updatefuncs[updatefuncs.length] = func;
  },
  doResize: function () {
    for (let i = 0; i < resizefuncs.length; i++) {
      const element = resizefuncs[i];
      element();
    }
  },
  registerResizeEvent: function (func: () => void) {
    resizefuncs.push(func);
  },
};
window.onresize = engineCore.doResize;
window.onscroll = engineCore.doResize;
export default engineCore;
