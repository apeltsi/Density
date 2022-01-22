/**
 * 2-Dimensional Vector with some built in math functions.
 */
export class Vec2 {
  x: number;
  y: number;
  /**
   * Consturctor for the Vec2 class. 2-Dimensional Vector.
   * @constructor
   * @param {number} x - X value
   * @param {number} y - Y value
   * @example new Vec2(2, 5); //Returns {2,5}
   * @returns {Vec2} {2,5}
   * @example new Vec2(); //Returns {0,0}
   * @returns {Vec2}{0,0}
   * @example new Vec2(1); // Returns {1,1}
   * @returns {Vec2} {1,1}
   *
   */
  constructor(x: number = undefined, y: number = undefined) {
    if (y != undefined) {
      // Vec2(x,y)
      this.x = x;
      this.y = y;
    } else if (x == undefined) {
      // Vec2()
      this.x = 0;
      this.y = 0;
    } else if (y == undefined) {
      // Vec2(x)
      this.x = x;
      this.y = x;
    }
  }
  /**
   * Adds a vector to this vector
   * @param {Vec2} vec_ Vector to add
   * @returns this + vec_
   */
  addV(vec_: Vec2) {
    return new Vec2(this.x + vec_.x, this.y + vec_.y);
  }
  /**
   * Subtracts a vector to from vector
   * @param {Vec2} vec_ Vector to subtract by
   * @returns this - vec_
   */
  subV(vec_: Vec2) {
    return new Vec2(this.x - vec_.x, this.y - vec_.y);
  }
  /**
   * Gets the dot product of this vector
   * @param {Vec2} vec_ Other vector
   * @returns this.x * vec_.x + this.y * vec_.y
   */
  dot(vec_: Vec2) {
    return this.x * vec_.x + this.y * vec_.y;
  }
  /**
   * Returns length of vector
   */
  get length() {
    return Math.sqrt(this.dot(this));
  }
  /**
   * Divides this vector by the value provided
   * @param {number} value Value to divide by
   * @returns this / value
   */
  divS(value: number) {
    return new Vec2(this.x / value, this.y / value);
  }
  /**
   * Multiplies this vector by another vector
   * @param {Vec2} vec_ Vector to multiply by
   * @returns this * vec_
   */
  mulV(vec_: Vec2) {
    return new Vec2(this.x * vec_.x, this.y * vec_.y);
  }
  /**
   *
   * @param {number} value Value to multiply by
   * @returns this * value
   */
  mulS(value: number) {
    return new Vec2(this.x * value, this.y * value);
  }
  /**
   *
   * @param {number} min Minimum value
   * @param {number} max Maximum value
   * @returns {Vec2} Clamped value
   */
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
  /**
   * Returns magnitude of vector
   * @returns {number} The magnitude of the vector
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   *
   * @returns {Vec2} The normalized vector
   */
  normalize() {
    var m = this.magnitude();
    return this.divS(m);
  }
  /**
   * Rounds a vector
   * @returns {Vec2} The rounded vector
   */
  round() {
    return new Vec2(Math.round(this.x), Math.round(this.y));
  }
}
export default {
  /**
   * Calculates distance between vectors
   * @param avec First vector
   * @param bvec Second vector
   * @returns Distance between vectors
   */
  distance: function (avec: Vec2, bvec: Vec2) {
    var a = avec.x - bvec.x;
    var b = avec.y - bvec.y;

    return Math.sqrt(a * a + b * b);
  },
  /**
   * Linearly interpolates between two values by the amount given
   * @param v0 From value
   * @param v1 To value
   * @param t Time
   * @returns Interpolated value
   */
  lerp: function (v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
  },
  /**
   * Linearly interpolates between two vectors by the amount given
   * @param v0 From vector
   * @param v1 To vector
   * @param t Time
   * @returns Interpolated vector
   */
  veclerp: function (v0: Vec2, v1: Vec2, t: number) {
    return new Vec2(v0.x * (1 - t) + v1.x * t, v0.y * (1 - t) + v1.y * t);
  },
  /**
   * Clamps input between maximum and minimum value
   * @param value Input val
   * @param min Minimun value
   * @param max Maximum value
   * @returns Clamped value
   */
  clamp: function (value: number, min: number, max: number) {
    if (value > max) {
      value = max;
    }
    if (value < min) {
      value = min;
    }
    return value;
  },
  /**
   * Returns the highest value in the provided array
   * @param values Values
   * @returns The highest value in the array
   */
  high: function (values: number[]) {
    let high: number = Number.NEGATIVE_INFINITY;
    values.forEach((element: number) => {
      if (element > high) {
        high = element;
      }
    });
    return high;
  },
  /**
   * Returns the lowest value in the provided array
   * @param values Values
   * @returns The lowest value in the array
   */
  low: function (values: number[]) {
    let low: number = Number.POSITIVE_INFINITY;
    values.forEach((element: number) => {
      if (element < low) {
        low = element;
      }
    });
    return low;
  },
  /**
   * Returns a bounding box that can fit all points.
   * @param points Points
   * @param width Radius of each point
   * @returns Bounding box of all points
   */
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
  vecabs(a: Vec2) {
    return new Vec2(Math.abs(a.x), Math.abs(a.y));
  },
};
