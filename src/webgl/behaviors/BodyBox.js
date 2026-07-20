import { box } from "crashcat"
import { Body } from './Body'
export class BodyBox extends Body {
  createShape() {
    const { width, height, depth } = this.object.geometry.parameters
    const bodyBias = 0.005

    const x = width / 2 + bodyBias
    const y = height / 2 + bodyBias
    const z = depth / 2 + bodyBias

    this.shape = box.create({ halfExtents: [x, y, z] })
  }
}
