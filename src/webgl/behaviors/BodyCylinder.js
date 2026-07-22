import { cylinder } from "crashcat"
import { Body } from './Body'
import { Vector3 } from 'three'

export class BodyCylinder extends Body {
  createShape() {
    const { name, geometry } = this.object

    const size = new Vector3()
    geometry.boundingBox.getSize(size)

    this.shape = cylinder.create({
      halfHeight: size.y * 0.5 + this.bodyBias,
      radius: size.x * 0.5 + this.bodyBias,
    })
  }
}
