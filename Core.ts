import { PriorityQueue, QElement } from "./PriorityQueue";
import math, { Vec2 } from "./Math";
export { math, Vec2 };
export interface EntityProps {
  id: any; // Unique ID for every entity
  priority: number; // What layer should entity be rendered on higher = rendered later
  pos: Vec2; // Global position. 0 0 = center of screen
  scale: Vec2; // Global scale of entity
  global: boolean; // Should entity use local or global coordinate system
  visible: boolean; // Should object be rendered?
  parallax: Vec2; // Should parallax be used?
  renderer: Density; // What instance is rendering this entity?
}
export enum FrameMode {
  Browser, // Render frame on requestAnimationFrame
  Manual, // Render frame when requested
}
export class Entity {
  id: any; // Unique ID for every entity
  priority: number; // What layer should entity be rendered on higher = rendered later
  pos: Vec2; // Global position. 0 0 = center of screen
  scale: Vec2; // Global scale of entity
  global: boolean; // Should entity use local or global coordinate system
  visible: boolean; // Should object be rendered?
  parallax: Vec2; // Should parallax be used?
  renderer: Density; // What instance is rendering this entity?

  constructor(args: EntityProps) {
    Object.assign(this, args);
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
  }
  remove() {
    this.renderer.removeDraw(this.id);
  }
}

interface Stats {
  lastFrameTime: number;
  currentFrameTime: number;
  frameCount: number;
  startTime: number;
  ver: String;
}
interface settings {
  doCulling: boolean;
  frameMode: FrameMode;
}
export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// THIS SCRIPT HANDLES THE RENDERING SYSTEM
export class Density {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  engine_entities = new PriorityQueue(); // ENTITIES OR RENDER QUEUE

  updatefuncs: (() => void)[] = [];
  resizefuncs: (() => void)[] = [];
  idsInUse: any[] = [];
  renderScale = 1;
  doCulling = true;
  frameMode = FrameMode.Manual;
  constructor(
    settings: settings = <settings>{
      doCulling: true,
      frameMode: FrameMode.Browser,
    }
  ) {
    this.doCulling = settings.doCulling;
    this.frameMode = settings.frameMode;
    if (document.getElementsByTagName("canvas").length == 0) {
      this.canvas = document.createElement("canvas");
      this.canvas.style.minHeight = "1px";
      this.canvas.style.minWidth = "1px";

      document.body.appendChild(this.canvas);
      this.canvas = this.canvas;
      this.c = this.canvas.getContext("2d");
      console.log(
        "Density couldn't find a canvas. Creating and appending a new one."
      );
    }
    if (this.frameMode == FrameMode.Browser) {
      requestAnimationFrame(() => this.frame());
    }
    this.doResize(this);
    this.stats.startTime = Date.now();
    this.resizefuncs.push(function resize() {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.canvasOffset = new Vec2(
        this.canvas.getBoundingClientRect().left,
        this.canvas.getBoundingClientRect().top
      );
    });
    window.onresize = () => this.doResize(this);
  }

  stats: Stats = {
    lastFrameTime: 0,
    currentFrameTime: 0,
    frameCount: 0,
    startTime: 0,
    ver: "3.0",
  };
  width: number;
  height: number;
  camPos = new Vec2(0, 0);
  canvasOffset: Vec2 = new Vec2(0, 0);

  inRenderFrame(pos: Vec2, w: number, h: number) {
    // Culling
    if (!this.doCulling) {
      return true;
    }
    if (
      Math.abs(pos.x - this.getCamCenter().x) >
        (this.canvas.width / 2 + w) / this.renderScale ||
      Math.abs(pos.y - this.getCamCenter().y) >
        (this.canvas.height / 2 + h + this.height) / this.renderScale
    ) {
      return false;
    } else {
      return true;
    }
  }

  frame() {
    // DRAWS A FRAME
    this.updatefuncs.forEach((func: () => void) => {
      func();
    });
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let entitiesQueue = new PriorityQueue(this.engine_entities.items);
    let length = entitiesQueue.length;
    for (let i = 0; i < length; i++) {
      let item = entitiesQueue.dequeue().element.element;
      if (item == undefined) {
        console.error("ILLEGAL ENTITY");
        if (this.frameMode == FrameMode.Browser) {
          requestAnimationFrame(() => this.frame());
        }
        return;
      }
      if (!item.visible) {
        continue;
      }
      if (
        this.inRenderFrame(item.pos, item.scale.x, item.scale.y) ||
        !item.global
      ) {
        let posModifierX = 0;
        let posModifierY = 0;
        let modifiedX = item.pos.x;
        let modifiedY = item.pos.y;
        let modifiedW = item.scale.x;
        let modifiedH = item.scale.y;
        if (item.global) {
          modifiedX =
            (item.pos.x - this.camPos.x - posModifierX - item.scale.x / 2) *
              this.renderScale *
              item.parallax.x +
            this.width / 2;
          modifiedY =
            (-item.pos.y + this.camPos.y + posModifierY - item.scale.y / 2) *
              this.renderScale *
              item.parallax.y +
            this.height / 2;
          modifiedW = item.scale.x * this.renderScale;
          modifiedH = item.scale.y * this.renderScale;
        } else {
          modifiedX = item.pos.x - posModifierX;
          modifiedY = -item.pos.y + posModifierY;
        }
        this.c.translate(modifiedX, modifiedY);
        item.render(item, modifiedW, modifiedH, this.c);
        this.c.translate(-modifiedX, -modifiedY);
      }
    }
    this.stats.currentFrameTime = Date.now() - this.stats.lastFrameTime;
    this.stats.lastFrameTime = Date.now();
    this.stats.frameCount++;
    if (this.frameMode == FrameMode.Browser) {
      requestAnimationFrame(() => this.frame());
    }
  }
  setRenderScale(scale: number) {
    this.renderScale = scale;
  }
  moveCamera(pos: Vec2) {
    this.camPos = pos;
  }
  localToGlobal(pos: Vec2) {
    return new Vec2(
      (pos.x + this.camPos.x - this.width / 2) / this.renderScale,
      (pos.y + this.camPos.y - this.height / 2) / this.renderScale
    );
  }
  draw(entity: Entity) {
    if (entity == undefined) {
      console.error("ILLEGAL ENTITY");
      return undefined;
    }
    if (entity.id == undefined) {
      entity.id = this.getEntityID();
    }
    entity.renderer = this;
    this.idsInUse[this.idsInUse.length] = entity.id;
    const index = this.engine_entities.enqueue(entity, entity.priority);
    return this.engine_entities.items[index].element;
  }
  removeDraw(id: number) {
    this.engine_entities.remove(id);
  }
  changeDraw(id: any, newEntity: Entity) {
    // REPLACES THE DRAWABLE
    this.removeDraw(id);
    return this.draw(newEntity);
  }
  getEntityID() {
    let id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
    for (let i = 0; i < this.idsInUse.length; i++) {
      if (this.idsInUse[i] == id) {
        // THIS CHECK IS ACTUALLY VERY STUPID, BUT IS DONE FOR CONSISTENCY IN THE CODE(ALSO TO PREVENT MY ANXIETY)
        id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
      }
    }
    return id;
  }
  getCamCenter() {
    return new Vec2(this.camPos.x, this.camPos.y);
  }
  registerUpdateEvent(func: () => void) {
    this.updatefuncs[this.updatefuncs.length] = func;
  }
  doResize(renderer: Density) {
    for (let i = 0; i < renderer.resizefuncs.length; i++) {
      const element = renderer.resizefuncs[i];
      element();
    }
  }
  registerResizeEvent(func: () => void) {
    this.resizefuncs.push(func);
  }
}
