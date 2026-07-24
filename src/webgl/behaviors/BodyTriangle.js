import { Vector3 } from 'three/webgpu'
import { triangleMesh, MotionType } from "crashcat"
import { Body } from './Body'

export class BodyTriangle extends Body {
  bodyGeometry = null

  constructor(motionType = MotionType.STATIC, bodyGeometry = null) {
    super(motionType)

    this.bodyGeometry = bodyGeometry
  }

  createShape() {
    const allPositions = []
    const allIndices = []

    let { geometry } = this.object
    this.bodyGeometry && (geometry = this.bodyGeometry)

    const positions = geometry.getAttribute('position')
    const indices = geometry.getIndex()

    this.shape = triangleMesh.create({
      positions: [...positions.array],
      indices: [...indices.array],
    })
  }
}
