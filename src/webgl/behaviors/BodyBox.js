import { rigidBody, MotionType, box } from "crashcat"
import { Body } from './Body'

export class BodyBox extends Body {
  onAwake() {
    super.onAwake()
  }

  createBody() {
    this.body = rigidBody.create(this.ctx.modules.physics.world, {
      motionType: this.motionType,
      shape: this.shape,
      position: this.object.position.clone().toArray(),
      quaternion: this.object.quaternion.clone().toArray(),
      restitution: 0.5,
      objectLayer: this.objectLayer,
    })

    this.object.userData.bodyId = this.body.id
  }

  createShape() {
    const { width, height, depth } = this.object.geometry.parameters
    const bodyBias = 0.005

    const x = width / 2 + bodyBias
    const y = height / 2 + bodyBias
    const z = depth / 2 + bodyBias

    this.shape = box.create({ halfExtents: [x, y, z] })
  }
}
