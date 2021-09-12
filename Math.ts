export class Vec2 {
  x: number;
  y: number;
  constructor(x: number, y: number = undefined) {
    if (y == undefined) {
      this.x = x;
      this.y = x;
    } else {
      this.x = x;
      this.y = y;
    }
  }
  addV(vec_: Vec2) {
    return new Vec2(this.x + vec_.x, this.y + vec_.y);
  }
  subV(vec_: Vec2) {
    return new Vec2(this.x - vec_.x, this.y - vec_.y);
  }
  dot(vec_: Vec2) {
    return this.x * vec_.x + this.y * vec_.y;
  }
  get length() {
    return Math.sqrt(this.dot(this));
  }
  divS(value: number) {
    return new Vec2(this.x / value, this.y / value);
  }
  mulV(vec_: Vec2) {
    return new Vec2(this.x * vec_.x, this.y * vec_.y);
  }
  mulS(value: number) {
    return new Vec2(this.x * value, this.y * value);
  }
  clamp(min: number, max: number) {
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
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    var m = this.magnitude();
    return this.divS(m);
  }

  round() {
    return new Vec2(Math.round(this.x), Math.round(this.y));
  }
}
export default {
  distance: function (avec: Vec2, bvec: Vec2) {
    var a = avec.x - bvec.x;
    var b = avec.y - bvec.y;

    return Math.sqrt(a * a + b * b);
  },
  OneDDistance: function (a: number, b: number) {
    var r = a - b;

    return Math.abs(r);
  },
  lerp: function (v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
  },
  veclerp: function (v0: Vec2, v1: Vec2, t: number) {
    return new Vec2(v0.x * (1 - t) + v1.x * t, v0.y * (1 - t) + v1.y * t);
  },
  clamp: function (value: number, min: number, max: number) {
    if (value > max) {
      value = max;
    }
    if (value < min) {
      value = min;
    }
    return value;
  },
  high: function (a: number, b: number) {
    if (a > b) {
      return a;
    }
    if (b > a) {
      return b;
    }
  },
  low: function (a: number, b: number) {
    if (b > a) {
      return a;
    }
    if (a > b) {
      return b;
    }
  },
  getBoundingBox: function (points: Vec2[], width: number) {
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
  },
};
