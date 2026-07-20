import { sphere } from "crashcat"
import { Body } from './Body'

export class BodySphere extends Body {
  createShape() {
    const { radius } = this.object.geometry.parameters

    this.shape = sphere.create({ radius })
  }
}
