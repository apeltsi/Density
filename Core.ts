import { PriorityQueue, QElement } from "./PriorityQueue";
import math, { Vec2 } from "./Math";
export { math, Vec2 };

export interface EntityProps {
  id: any;
  priority: number;
  pos: Vec2;
  scale: Vec2;
  global: boolean;
  visible: boolean;
  parallax: Vec2;
  renderer: Density;
}
export enum FrameMode {
  Browser,
  Manual,
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
  renderer: Density;

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
    if (this.opacity == undefined) {
      this.opacity = 1;
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
      math.OneDDistance(pos.x, this.getCamCenter().x) >
        (this.canvas.width / 2 + w) / this.renderScale ||
      math.OneDDistance(pos.y, this.getCamCenter().y) >
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
  draw(
    entity: Entity = new Rectangle(<RectangleProps>{
      pos: new Vec2(0, 0),
      scale: new Vec2(100, 100),
      global: true,
      color: "",
      visible: true,
    })
  ) {
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

// Default Entity Prototypes
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
      ctx.lineWidth = item.stroke.width * this.renderer.renderScale;
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
      scale = this.renderer.renderScale;
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