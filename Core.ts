import { PriorityQueue, QElement } from "./PriorityQueue";
import math, { Vec2 } from "./Math";
export { math, Vec2 };
export interface EntityProps {
  id: any; // Unique ID for every entity
  priority: number; // What layer should entity be rendered on higher = rendered later
  pos: Vec2; // Global position. (0,0) = center of screen
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
  private _priority: number; // What layer should entity be rendered on higher = rendered later
  pos: Vec2; // Global position. 0 0 = center of screen
  scale: Vec2; // Global scale of entity
  global: boolean; // Should entity use local or global coordinate system
  visible: boolean; // Should object be rendered?
  parallax: Vec2; // Should parallax be used?
  renderer: Density; // What instance is rendering this entity?

  public get priority() {
    return this._priority;
  }
  public set priority(priority: number) {
    // We have to re-insert this entity in to the entity queue to reorder by the new priority
    this._priority = priority;
    if (this.renderer == undefined) {
      // Nothing to do as the entity currently isn't being rendered and doesn't exist on a entity queue
      return;
    } else {
      this.renderer.removeDraw(this.id);
      this.renderer.draw(this);
      return;
    }
  }
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
    this.renderer = undefined; // Remove our reference to the renderer at it is no longer needed
  }
  /**
   * Translates global position to object position. (Canvas space with offset)
   */
  getLocalPos() {
    let modifiedX = this.pos.x;
    let modifiedY = this.pos.y;
    if (this.global) {
      modifiedX =
        (this.pos.x - this.renderer.camPos.x - this.scale.x / 2) *
          this.renderer.renderScale *
          this.parallax.x +
        this.renderer.width / 2;
      modifiedY =
        (-this.pos.y + this.renderer.camPos.y - this.scale.y / 2) *
          this.renderer.renderScale *
          this.parallax.y +
        this.renderer.height / 2;
    } else {
      modifiedX = this.pos.x;
      modifiedY = -this.pos.y;
    }
    return new Vec2(modifiedX, modifiedY);
  }
  globalToLocal(global: Vec2) {
    if (this.renderer == undefined) {
      return null;
    }
    let modifiedX = global.x;
    let modifiedY = global.y;
    if (this.global) {
      modifiedX =
        (global.x - this.renderer.camPos.x) *
          this.renderer.renderScale *
          this.parallax.x +
        this.renderer.width / 2;
      modifiedY =
        (-global.y + this.renderer.camPos.y) *
          this.renderer.renderScale *
          this.parallax.y +
        this.renderer.height / 2;
    } else {
      modifiedX = global.x;
      modifiedY = -global.y;
    }
    let diff = new Vec2(modifiedX, modifiedY).subV(this.getLocalPos());
    return diff;
  }
}

interface Stats {
  lastFrameTime: number;
  currentFrameTime: number;
  frameCount: number;
  startTime: number;
  ver: String;
}
export interface Settings {
  doCulling: boolean; // Should density cull drawables outside of the view
  frameMode: FrameMode; // Should density automatically render whenever the browser allows or only when frame() is called
  canvas: HTMLCanvasElement; // Canvas to render on
  doClear: boolean; //Should the canvas be cleared before every frame
}
export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// THIS SCRIPT HANDLES THE RENDERING SYSTEM
export class Density {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  engine_entities = new PriorityQueue(); // ENTITIES OR RENDER QUEUE

  updatefuncs: ((renderer: Density) => void)[] = [];
  resizefuncs: ((renderer: Density) => void)[] = [];
  idsInUse: any[] = [];
  renderScale = 1;
  doCulling = true;
  frameMode = FrameMode.Browser;
  doClear = true; // Should the canvas be cleared before every frame
  constructor(
    settings: Settings = <Settings>{
      doCulling: true,
      frameMode: FrameMode.Browser,
      canvas: undefined,
      doClear: true,
    }
  ) {
    if (settings.doCulling != undefined) {
      this.doCulling = settings.doCulling;
    }
    if (settings.frameMode != undefined) {
      this.frameMode = settings.frameMode;
    }
    if (settings.doClear != undefined) {
      this.doClear = settings.doClear;
    }
    if (settings.canvas == undefined) {
      this.canvas = document.createElement("canvas");
      this.canvas.style.minHeight = "1px";
      this.canvas.style.minWidth = "1px";

      document.body.appendChild(this.canvas);
      this.canvas = this.canvas;
      this.c = this.canvas.getContext("2d");
      console.log("No canvas was specified. Creating and appending a new one.");
    } else {
      this.canvas = settings.canvas;
      this.c = this.canvas.getContext("2d");
    }

    if (this.frameMode == FrameMode.Browser) {
      requestAnimationFrame(() => this.frame());
    }
    this.stats.startTime = Date.now();
    this.resizefuncs.push(function resize(renderer: Density) {
      //renderer.canvas.width = renderer.canvas.clientWidth;
      //renderer.canvas.height = renderer.canvas.clientHeight;
      renderer.width = renderer.canvas.width;
      renderer.height = renderer.canvas.height;
      renderer.canvasOffset = new Vec2(
        renderer.canvas.getBoundingClientRect().left,
        renderer.canvas.getBoundingClientRect().top
      );
    });
    this.doResize(this);
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
  /**
   * Translates a point from html Canvas space to Density Space
   * @param point Point to be translated
   * @returns {Vec2} Translated point
   */
  translatePoint(point: Vec2) {
    point = new Vec2(
      (point.x / this.canvas.clientWidth) * this.width,
      (point.y / this.canvas.clientHeight) * this.height
    );
    return new Vec2(
      (point.x + this.camPos.x) * this.renderScale + -this.canvas.width / 2,
      (-point.y + this.camPos.y) * this.renderScale + this.canvas.height / 2
    );
  }

  frame() {
    // DRAWS A FRAME
    this.updatefuncs.forEach((func: (renderer: Density) => void) => {
      func(this);
    });
    if (this.doClear)
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
        let modifiedX = item.pos.x;
        let modifiedY = item.pos.y;
        let modifiedW = item.scale.x;
        let modifiedH = item.scale.y;
        if (item.global) {
          modifiedX =
            (item.pos.x - this.camPos.x - item.scale.x / 2) *
              this.renderScale *
              item.parallax.x +
            this.width / 2;
          modifiedY =
            (-item.pos.y + this.camPos.y - item.scale.y / 2) *
              this.renderScale *
              item.parallax.y +
            this.height / 2;
          modifiedW = item.scale.x * this.renderScale;
          modifiedH = item.scale.y * this.renderScale;
        } else {
          modifiedX = item.pos.x;
          modifiedY = -item.pos.y;
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
      entity.id = this.generateEntityID();
    }
    entity.renderer = this;
    this.idsInUse[this.idsInUse.length] = entity.id;
    const index = this.engine_entities.enqueue(entity, entity.priority);
    return this.engine_entities.items[index].element;
  }
  /**
   *
   * @param id Entity ID to remove
   */
  removeDraw(id: number) {
    this.engine_entities.remove(id);
  }
  /**
   * Replaces an entity in the entity queue
   * @deprecated Function will be removed in the future. Change values manually instead.
   * @param id Id of entity
   * @param newEntity New entity
   * @returns Entity reference
   */
  changeDraw(id: any, newEntity: Entity) {
    // Replaces the entity
    this.removeDraw(id);
    return this.draw(newEntity);
  }
  generateEntityID() {
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
      element(renderer);
    }
  }
  registerResizeEvent(func: () => void) {
    this.resizefuncs.push(func);
  }
}
export default Density;
