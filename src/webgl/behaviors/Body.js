import { Object3DBehaviour } from 'three-start'
import { MotionType, rigidBody } from 'crashcat'

export class Body extends Object3DBehaviour {
  motionType = MotionType.STATIC
  objectLayer = null
  body = null
  shape = null

  constructor(motionType = MotionType.STATIC) {
    super()

    this.motionType = motionType
  }

  onAwake() {
    const { OBJECT_LAYER_NOT_MOVING, OBJECT_LAYER_MOVING } = this.ctx.modules.physics
    this.objectLayer = this.motionType === MotionType.STATIC ? OBJECT_LAYER_NOT_MOVING : OBJECT_LAYER_MOVING

    this.createShape()
    this.createBody()
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

  createBody() {
    this.body = rigidBody.create(this.ctx.modules.physics.world, {
      motionType: this.motionType,
      shape: this.shape,
      position: this.object.position.clone().toArray(),
      quaternion: this.object.quaternion.clone().toArray(),
      restitution: 0.5,
      objectLayer: this.objectLayer,
    })
  }

  createShape() {}
}
