
# Density 3
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Density is the web graphics drawing engine powered by TypeScript. Density uses the HTML5 Canvas Graphics API. This makes drawing simple things such as sprites, lines, or rectangles super easy!


## Basic Concepts
### Entities
Density is NOT an ECS. Instead, each entity has an associated class. But you can still use the JS/TS extend keyword for entities that share large portions of logic. 

Each entity has a priority. Density will render entities from lowest to highest. Meaning that an entity with priority 0 will be rendered before one with priority 1. This means that the first entity will appear behind the second. 

Entities can be added to an instance of density using the draw method. Like this:
```typescript
let myEntity = renderer.draw(entity);
```
The function will return a reference to the entity so that you can change the values of the entity such as position.

### Instances
You can create a new instance of Density like this: 
```typescript
let renderer = new Density();
```
Each instance of Density has a canvas associated with it. If no canvas is specified a new one will be created. 

Different instances of Density run independently of each other with their own set of entities and settings.

### Vectors
Density includes a math library with useful functions for doing vector math. Below is an example of some vector math with Density:
```typescript
import { Vec2 } from "density"; // The Vec2 class is re-exported in Density Core
let vec = new Vec2(); // new vector with the value (0,0). You may also use 'new Vec2(0,0)' if you prefer that syntax
let otherVec = new Vec2(10); // If one value is provided it is applied to both axes. You may also write 'new Vec2(10, 10)'
let resultant = vec.addV(otherVec);
console.log(resultant);
```

## Coming from Density 2

This is the Rewrite of Density 2.0 in TypeScript. Density 3 SHOULD be faster, smaller, and easier to use. The project structure is also a LOT better! Density 3 Also supports instancing. This means that the old density-cluster-renderer is finally gone! 

## Docs coming soon (maybe?)
When I have the time...

### More info will be posted on my website:
[Solid Code](https://solidcodegames.com/density)
