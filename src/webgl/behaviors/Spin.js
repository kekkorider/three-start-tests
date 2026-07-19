import { Object3DBehaviour } from 'three-start'

export class Spin extends Object3DBehaviour {
  speed = 1

  onAwake() {
    console.log('Spin onAwake')
  }

  onUpdate() {
    this.object.rotation.y += this.speed * this.ctx.getDeltaTime()
  }
}
