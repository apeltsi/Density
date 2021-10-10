// Default Entity Prototypes

import { Entity, EntityProps } from "./Core";

export interface Outline {
  color: string;
  width: number;
}

export interface RectangleProps extends EntityProps {
  color: string;
  stroke: Outline;
  opacity: number;
}
export class Rectangle extends Entity {
  color: string;
  stroke: Outline;
  opacity: number = 1;
  constructor(args: RectangleProps) {
    super(args);
    this.color = args.color;
    this.stroke = args.stroke;
    if (args.opacity != undefined) {
      this.opacity = args.opacity;
    }
  }
  render(
    item: Rectangle,
    modifiedW: number,
    modifiedH: number,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.rect(0, 0, modifiedW, modifiedH);
    ctx.fillStyle = item.color;

    ctx.fill();
    if (item.stroke) {
      ctx.strokeStyle = item.stroke.color;
      ctx.lineWidth = item.stroke.width * this.renderer.renderScale;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
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
