import { Object3DBehaviour } from 'three-start'

export class Spin extends Object3DBehaviour {
  speed = 1
  axis = 'y'

  constructor(axis = 'y', speed = 1) {
    super()

    this.axis = axis
    this.speed = speed
  }

  onUpdate() {
    this.object.rotation[this.axis] += this.speed * this.ctx.getDeltaTime()
  }
}
