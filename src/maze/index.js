/**
 * Maze generation library based on:
 * - https://github.com/codebox/mazes
 * - https://github.com/codebox/maze.js (vendored in ./lib)
 */

export { createMaze } from './createMaze.js'
export {
  VALID_SHAPES,
  VALID_ALGORITHMS,
  VALID_EXITS,
  SHAPE_SQUARE,
  SHAPE_TRIANGLE,
  SHAPE_HEXAGON,
  SHAPE_CIRCLE,
  ALGORITHM_NONE,
  ALGORITHM_BINARY_TREE,
  ALGORITHM_SIDEWINDER,
  ALGORITHM_ALDOUS_BRODER,
  ALGORITHM_WILSON,
  ALGORITHM_HUNT_AND_KILL,
  ALGORITHM_RECURSIVE_BACKTRACK,
  ALGORITHM_KRUSKAL,
  ALGORITHM_SIMPLIFIED_PRIMS,
  ALGORITHM_TRUE_PRIMS,
  ALGORITHM_ELLERS,
  EXITS_NONE,
  EXITS_HORIZONTAL,
  EXITS_VERTICAL,
  EXITS_HARDEST,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  DIRECTION_EAST,
  DIRECTION_WEST,
  DIRECTION_NORTH_WEST,
  DIRECTION_NORTH_EAST,
  DIRECTION_SOUTH_WEST,
  DIRECTION_SOUTH_EAST,
} from './createMaze.js'

export { config as shapesConfig } from './shapesConfig.js'
export { algorithms } from './lib/algorithms.js'
export { buildMaze } from './lib/main.js'
