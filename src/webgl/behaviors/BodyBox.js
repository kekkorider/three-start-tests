import { box } from "crashcat"
import { Body } from './Body'
export class BodyBox extends Body {
  createShape() {
    const { width, height, depth } = this.object.geometry.parameters

    const x = width / 2 + this.bodyBias
    const y = height / 2 + this.bodyBias
    const z = depth / 2 + this.bodyBias

    this.shape = box.create({ halfExtents: [x, y, z] })
  }
}
