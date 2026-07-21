# Maze (`src/maze`)

Local copy of [codebox/maze.js](https://github.com/codebox/maze.js) (the generation core used by [codebox/mazes](https://github.com/codebox/mazes)), wrapped for this project.

Use `createMaze` anywhere you need a maze as plain 2D points — no canvas or SVG required.

## Quick start

```js
import { createMaze } from './maze'

const maze = createMaze({
  width: 10,
  height: 10,
  cellShape: 'square',
  algorithm: 'recursiveBacktrack',
  seed: 42,
})

// maze is an array of { x, y } — one point per cell
for (const { x, y } of maze) {
  console.log(x, y)
}

// Extra data is attached to the same array:
maze.links   // passages between linked cells
maze.walls   // wall segments (square grids only)
maze.start   // start cell, or null
maze.end     // end cell, or null
maze.seed    // seed actually used
maze.grid    // raw maze.js grid (advanced)
```

## Import

```js
import { createMaze } from './maze'
// or
import { createMaze } from './maze/createMaze.js'
```

Named constants are also available:

```js
import {
  createMaze,
  SHAPE_SQUARE,
  ALGORITHM_RECURSIVE_BACKTRACK,
  EXITS_VERTICAL,
} from './maze'
```

## `createMaze(options)`

Generates a perfect maze (exactly one path between any two cells) and returns an **array of `{ x, y }` points** — one for every cell kept after masking.

### Return value

| Field | Type | Description |
| --- | --- | --- |
| *(array itself)* | `{ x, y }[]` | Every maze cell as a 2D point |
| `.points` | `{ x, y }[]` | Same as the array (alias) |
| `.links` | `{ from, to }[]` | Open passages between neighbouring cells |
| `.walls` | `{ a, b }[]` | Wall segments as corner pairs (square grids only; empty otherwise) |
| `.start` | `{ x, y } \| null` | Start exit cell when `exitConfig` is not `'no exits'` |
| `.end` | `{ x, y } \| null` | End exit cell when `exitConfig` is not `'no exits'` |
| `.seed` | `number` | Seed used for generation |
| `.cellShape` | `string` | Shape that was generated |
| `.algorithm` | `string` | Algorithm that was used |
| `.grid` | `object` | Underlying maze.js grid instance |

---

## Configuration

### Grid shape — `cellShape` (alias: `shape`)

| Value | Required size options | Notes |
| --- | --- | --- |
| `'square'` (default) | `width`, `height` | Orthogonal grid; `.walls` populated |
| `'triangle'` | `width`, `height` | Triangular cells |
| `'hexagon'` | `width`, `height` | Hexagonal cells |
| `'circle'` | `layers` | Concentric rings; coords are `[layer, index]` |

Suggested ranges from the original mazes UI (`shapesConfig.js`):

| Shape | Parameter | Min | Max | Default (UI) |
| --- | --- | --- | --- | --- |
| square | `width` / `height` | 2 | 50 | 10 |
| triangle | `width` | 4 | 85 | 17 |
| triangle | `height` | 2 | 50 | 10 |
| hexagon | `width` / `height` | 2 | 50 | 10 |
| circle | `layers` | 2 | 30 | 10 |

### Algorithm — `algorithm`

| Value | Description | Maskable | Supported shapes |
| --- | --- | --- | --- |
| `'none'` | Empty grid (no passages carved) | yes | square, triangle, hexagon, circle |
| `'binaryTree'` | Binary Tree | no | square |
| `'sidewinder'` | Sidewinder | no | square |
| `'aldousBroder'` | Aldous-Broder | yes | square, triangle, hexagon, circle |
| `'wilson'` | Wilson's algorithm | yes | square, triangle, hexagon, circle |
| `'huntAndKill'` | Hunt and Kill | yes | square, triangle, hexagon, circle |
| `'recursiveBacktrack'` (default) | Recursive Backtracker | yes | square, triangle, hexagon, circle |
| `'kruskal'` | Kruskal's algorithm | yes | square |
| `'simplifiedPrims'` | Simplified Prim's | yes | square, triangle, hexagon, circle |
| `'truePrims'` | True Prim's | yes | square, triangle, hexagon, circle |
| `'ellers'` | Eller's algorithm | no | square |

### Exits — `exitConfig`

| Value | Description |
| --- | --- |
| `'no exits'` (default) | No start/end markers |
| `'horizontal'` | Exits on left/right (or equivalent for the shape) |
| `'vertical'` | Exits on top/bottom (or equivalent for the shape) |
| `'hardest'` | Furthest pair of edge cells |

### Other options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number` | — | Columns (square / triangle / hexagon) |
| `height` | `number` | — | Rows (square / triangle / hexagon) |
| `layers` | `number` | — | Ring count (circle only) |
| `seed` | `number \| string` | `Date.now()` | RNG seed for reproducible mazes |
| `randomSeed` | `number \| string` | — | Alias for `seed` |
| `mask` | `[x, y][]` | `[]` | Cell coordinates removed before generation (only for maskable algorithms) |

---

## Examples

### Square maze

```js
const maze = createMaze({
  cellShape: 'square',
  width: 20,
  height: 12,
  algorithm: 'recursiveBacktrack',
  exitConfig: 'vertical',
  seed: 1001,
})

console.log(maze.length)       // number of cells
console.log(maze.walls.length) // wall segments for rendering
console.log(maze.start, maze.end)
```

### Hexagonal maze

```js
const maze = createMaze({
  cellShape: 'hexagon',
  width: 8,
  height: 8,
  algorithm: 'huntAndKill',
})
```

### Circular maze

```js
const maze = createMaze({
  cellShape: 'circle',
  layers: 10,
  algorithm: 'wilson',
  exitConfig: 'hardest',
})
```

### Masked shape (remove cells before carving)

```js
const maze = createMaze({
  cellShape: 'square',
  width: 15,
  height: 15,
  algorithm: 'recursiveBacktrack',
  mask: [
    [0, 0], [1, 0], [2, 0],
    [0, 1],
  ],
})
```

### Place cells in Three.js

```js
import { createMaze } from './maze'
import * as THREE from 'three'

const maze = createMaze({ width: 16, height: 16, seed: 7 })
const spacing = 1

for (const { x, y } of maze) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.2, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x88aacc }),
  )
  mesh.position.set(x * spacing, 0, y * spacing)
  scene.add(mesh)
}

// Optional: draw walls as thin boxes
for (const { a, b } of maze.walls) {
  // a / b are wall endpoints in grid corner space
}
```

---

## Folder layout

```
src/maze/
├── index.js           # public exports
├── createMaze.js      # createMaze wrapper (no DOM)
├── shapesConfig.js    # shape size ranges from codebox/mazes
├── README.md
├── LICENSE            # MIT (Rob Dawson / codebox)
└── lib/               # vendored https://github.com/codebox/maze.js
    ├── main.js        # original buildMaze (requires canvas/svg)
    ├── maze.js
    ├── algorithms.js
    ├── constants.js
    ├── drawingSurfaces.js
    ├── random.js
    ├── shapes.js
    └── utils.js
```

## Original `buildMaze`

The vendored `lib/main.js` still exports `buildMaze` for the browser UI API (needs a canvas or SVG element). Prefer `createMaze` in this project.

```js
import { buildMaze } from './maze'
```

## Credits

- [codebox/mazes](https://github.com/codebox/mazes) — maze generator UI
- [codebox/maze.js](https://github.com/codebox/maze.js) — algorithms and grids
- Inspired by *Mazes for Programmers* by Jamis Buck
- Licensed under MIT (see `LICENSE`)
