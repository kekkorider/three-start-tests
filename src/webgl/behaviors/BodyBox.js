import { rigidBody, MotionType, box } from "crashcat"
import { Object3DBehaviour } from "three-start"

export class BodyBox extends Object3DBehaviour {
  constructor(motionType = MotionType.STATIC) {
    super()

    this.motionType = motionType
  }

  onAwake() {
    const layer = this.motionType === MotionType.STATIC ?
                          this.ctx.modules.physics.OBJECT_LAYER_NOT_MOVING :
                          this.ctx.modules.physics.OBJECT_LAYER_MOVING

    const { width, height, depth } = this.object.geometry.parameters
    const bodyBias = 0.005

    const x = width / 2 + bodyBias
    const y = height / 2 + bodyBias
    const z = depth / 2 + bodyBias

    this.body = rigidBody.create(this.ctx.modules.physics.world, {
      motionType: this.motionType,
      shape: box.create({ halfExtents: [x, y, z] }),
      position: this.object.position.clone().toArray(),
      quaternion: this.object.quaternion.clone().toArray(),
      restitution: 0.5,
      objectLayer: layer,
    })
  }

  onUpdate() {
    if (this.motionType === MotionType.STATIC) return

    this.object.position.set(
      this.body.position[0],
      this.body.position[1],
      this.body.position[2],
    )

    this.object.quaternion.set(
      this.body.quaternion[0],
      this.body.quaternion[1],
      this.body.quaternion[2],
      this.body.quaternion[3],
    )
  }

  createShape() {}
}
