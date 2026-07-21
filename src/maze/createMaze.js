import { buildSquareGrid, buildTriangularGrid, buildHexagonalGrid, buildCircularGrid } from './lib/maze.js'
import { buildRandom } from './lib/random.js'
import { algorithms } from './lib/algorithms.js'
import {
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
  METADATA_START_CELL,
  METADATA_END_CELL,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  DIRECTION_EAST,
  DIRECTION_WEST,
  DIRECTION_NORTH_WEST,
  DIRECTION_NORTH_EAST,
  DIRECTION_SOUTH_WEST,
  DIRECTION_SOUTH_EAST,
} from './lib/constants.js'

const VALID_SHAPES = [SHAPE_SQUARE, SHAPE_TRIANGLE, SHAPE_HEXAGON, SHAPE_CIRCLE]

const VALID_ALGORITHMS = [
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
]

const VALID_EXITS = [EXITS_NONE, EXITS_HORIZONTAL, EXITS_VERTICAL, EXITS_HARDEST]

const shapeBuilders = {
  [SHAPE_SQUARE]: buildSquareGrid,
  [SHAPE_TRIANGLE]: buildTriangularGrid,
  [SHAPE_HEXAGON]: buildHexagonalGrid,
  [SHAPE_CIRCLE]: buildCircularGrid,
}

/** No-op drawing surface so maze generation works without a canvas/svg element. */
function createNoopDrawingSurface() {
  return {
    on() {},
    dispose() {},
    setSpaceRequirements() {},
    clear() {},
    setColour() {},
    fillPolygon() {},
    line() {},
    arc() {},
    fillSegment() {},
    convertCoords(...coords) {
      return coords
    },
  }
}

function toPoint(coords) {
  return { x: coords[0], y: coords[1] }
}

function validateOptions(options = {}) {
  const cellShape = options.cellShape ?? options.shape ?? SHAPE_SQUARE
  const algorithm = options.algorithm ?? ALGORITHM_RECURSIVE_BACKTRACK
  const exitConfig = options.exitConfig ?? EXITS_NONE

  if (!VALID_SHAPES.includes(cellShape)) {
    throw new Error(`Invalid cellShape "${cellShape}". Expected one of: ${VALID_SHAPES.join(', ')}`)
  }

  if (!VALID_ALGORITHMS.includes(algorithm)) {
    throw new Error(`Invalid algorithm "${algorithm}". Expected one of: ${VALID_ALGORITHMS.join(', ')}`)
  }

  if (!VALID_EXITS.includes(exitConfig)) {
    throw new Error(`Invalid exitConfig "${exitConfig}". Expected one of: ${VALID_EXITS.join(', ')}`)
  }

  if ([SHAPE_SQUARE, SHAPE_TRIANGLE, SHAPE_HEXAGON].includes(cellShape)) {
    if (!options.width || options.width < 1) {
      throw new Error('Missing/invalid "width" (required for square, triangle, and hexagon grids)')
    }
    if (!options.height || options.height < 1) {
      throw new Error('Missing/invalid "height" (required for square, triangle, and hexagon grids)')
    }
  }

  if (cellShape === SHAPE_CIRCLE) {
    if (!options.layers || options.layers < 1) {
      throw new Error('Missing/invalid "layers" (required for circle grids)')
    }
  }

  const supportedShapes = algorithms[algorithm].metadata.shapes
  if (!supportedShapes.includes(cellShape)) {
    throw new Error(
      `Algorithm "${algorithm}" does not support cellShape "${cellShape}". Supported: ${supportedShapes.join(', ')}`,
    )
  }

  return { cellShape, algorithm, exitConfig }
}

function extractLinks(grid) {
  const links = []
  const seen = new Set()

  grid.forEachCell((cell) => {
    for (const neighbour of cell.links) {
      const key = [cell.id, neighbour.id].sort().join('|')
      if (seen.has(key)) continue
      seen.add(key)
      links.push({ from: toPoint(cell.coords), to: toPoint(neighbour.coords) })
    }
  })

  return links
}

function extractSquareWalls(grid) {
  const walls = []

  grid.forEachCell((cell) => {
    const [x, y] = cell.coords
    const north = cell.neighbours[DIRECTION_NORTH]
    const south = cell.neighbours[DIRECTION_SOUTH]
    const east = cell.neighbours[DIRECTION_EAST]
    const west = cell.neighbours[DIRECTION_WEST]
    const exitDirection = cell.metadata[METADATA_START_CELL] || cell.metadata[METADATA_END_CELL]

    if ((!north || !cell.isLinkedTo(north)) && exitDirection !== DIRECTION_NORTH) {
      walls.push({ a: { x, y }, b: { x: x + 1, y } })
    }
    if ((!west || !cell.isLinkedTo(west)) && exitDirection !== DIRECTION_WEST) {
      walls.push({ a: { x, y }, b: { x, y: y + 1 } })
    }
    // Only draw south/east edges when there is no neighbour in that direction,
    // so shared walls are not duplicated.
    if (!south && exitDirection !== DIRECTION_SOUTH) {
      walls.push({ a: { x, y: y + 1 }, b: { x: x + 1, y: y + 1 } })
    }
    if (!east && exitDirection !== DIRECTION_EAST) {
      walls.push({ a: { x: x + 1, y }, b: { x: x + 1, y: y + 1 } })
    }
  })

  return walls
}

function findExitPoint(grid, metadataKey) {
  let found = null
  grid.forEachCell((cell) => {
    if (cell.metadata[metadataKey] !== undefined) {
      found = toPoint(cell.coords)
    }
  })
  return found
}

/**
 * Generate a maze and return a 2D point for every cell produced by the algorithm.
 *
 * @param {object} [options]
 * @param {string} [options.cellShape='square'] - 'square' | 'triangle' | 'hexagon' | 'circle'
 * @param {string} [options.shape] - alias for cellShape
 * @param {number} [options.width] - grid width (square / triangle / hexagon)
 * @param {number} [options.height] - grid height (square / triangle / hexagon)
 * @param {number} [options.layers] - ring count (circle only)
 * @param {string} [options.algorithm='recursiveBacktrack']
 * @param {number|string} [options.seed] - RNG seed for reproducible mazes
 * @param {number|string} [options.randomSeed] - alias for seed
 * @param {Array<[number, number]>} [options.mask] - cell coords to remove before generation
 * @param {string} [options.exitConfig='no exits'] - 'no exits' | 'horizontal' | 'vertical' | 'hardest'
 * @returns {Array<{x: number, y: number}> & {
 *   points: Array<{x: number, y: number}>,
 *   links: Array<{from: {x: number, y: number}, to: {x: number, y: number}}>,
 *   walls: Array<{a: {x: number, y: number}, b: {x: number, y: number}}>,
 *   start: {x: number, y: number} | null,
 *   end: {x: number, y: number} | null,
 *   seed: number,
 *   cellShape: string,
 *   algorithm: string,
 *   grid: object,
 * }}
 */
export function createMaze(options = {}) {
  const { cellShape, algorithm, exitConfig } = validateOptions(options)
  const seed = Number(options.seed ?? options.randomSeed ?? Date.now())
  const random = buildRandom(seed)
  const buildGrid = shapeBuilders[cellShape]

  const grid = buildGrid({
    width: options.width,
    height: options.height,
    layers: options.layers,
    exitConfig,
    random,
    drawingSurface: createNoopDrawingSurface(),
  })

  grid.initialise()

  for (const maskedCoords of options.mask || []) {
    grid.removeCell(maskedCoords)
  }

  const iterator = algorithms[algorithm].fn(grid, { random })
  while (!iterator.next().done);
  grid.placeExits()

  const points = []
  grid.forEachCell((cell) => {
    points.push(toPoint(cell.coords))
  })

  points.points = points
  points.links = extractLinks(grid)
  points.walls = cellShape === SHAPE_SQUARE ? extractSquareWalls(grid) : []
  points.start = findExitPoint(grid, METADATA_START_CELL)
  points.end = findExitPoint(grid, METADATA_END_CELL)
  points.seed = seed
  points.cellShape = cellShape
  points.algorithm = algorithm
  points.grid = grid

  return points
}

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
}
