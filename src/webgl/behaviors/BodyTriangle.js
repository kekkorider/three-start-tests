import { Vector3 } from 'three/webgpu'
import { triangleMesh } from "crashcat"
import { Body } from './Body'

export class BodyTriangle extends Body {
  createShape() {
    const allPositions = []
    const allIndices = []

    const { geometry } = this.object

    const positions = geometry.getAttribute('position')
    const indices = geometry.getIndex()

    this.shape = triangleMesh.create({
      positions: [...positions.array],
      indices: [...indices.array],
    })
  }
}
