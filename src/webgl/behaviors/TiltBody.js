import { Vector2, Vector3, Quaternion } from 'three'
import { Object3DBehaviour } from 'three-start'
import { Observer } from '../../assets/js/gsap'

export class TiltBody extends Object3DBehaviour {
  body = null
  strength = 1

  constructor(strength = 1) {
    super()

    this.strength = strength
  }

  onAwake() {
    this.body = this.ctx.modules.physics.world.bodies.pool.find(body => body.id === this.object.userData.bodyId)
    this.createTilt()
  }

  createTilt() {
    const ndc = new Vector2()
    const screen = new Vector2()

    const axisX = new Vector3(1, 0, 0)
    const axisZ = new Vector3(0, 0, 1)

    const quaternionX = new Quaternion()
    const quaternionZ = new Quaternion()
    const quaternionXZ = new Quaternion()

    this.tilt = Observer.create({
      type: 'pointer',
      target: this.ctx.canvasContainer,
      onMove: (evt) => {
        screen.set(evt.x, evt.y)

        ndc.set(
          (screen.x / this.ctx.canvasContainer.clientWidth) * 2 - 1,
          -(screen.y / this.ctx.canvasContainer.clientHeight) * 2 + 1,
        )

        quaternionX.setFromAxisAngle(axisX, ndc.y * Math.PI / -12 * this.strength)
        quaternionZ.setFromAxisAngle(axisZ, ndc.x * Math.PI / -12 * this.strength)
        quaternionXZ.multiplyQuaternions(quaternionX, quaternionZ)

        this.body.quaternion = quaternionXZ.toArray()
      }
    })
  }
}
