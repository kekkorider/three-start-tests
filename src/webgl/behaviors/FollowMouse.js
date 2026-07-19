import * as THREE from 'three/webgpu'
import { Object3DBehaviour, ThreeContextEvents } from 'three-start'

import { gsap, Observer } from '../../assets/js/gsap'

export class FollowMouse extends Object3DBehaviour {
  ndc = new THREE.Vector3()
  coords = new THREE.Vector3()
  mouse = null
  canvasSize = new THREE.Vector2()

  invertX = false
  invertY = false
  scale = 2

  constructor(scale = 1, invertX = false, invertY = false) {
    super()

    this.scale = scale
    this.invertX = invertX
    this.invertY = invertY
  }

  onAwake() {
    this.createMouse()

    this.ctx.on(ThreeContextEvents.Resized, this.handleResize.bind(this))
  }

  onDestroy() {
    this.mouse.kill()
    this.ctx.off(ThreeContextEvents.Resized, this.handleResize.bind(this))
  }

  onEnable() {
    this.mouse.enable()
  }

  onDisable() {
    this.mouse.disable()
  }

  createMouse() {
    this.mouse = Observer.create({
      type: 'pointer',
      target: this.ctx.canvasContainer,
      onMove: (event) => {
        // REF: https://stackoverflow.com/a/36071100
        this.ndc.setComponent(0, (event.x / this.canvasSize.x) * 2 - 1)
        this.ndc.setComponent(1, -(event.y / this.canvasSize.y) * 2 + 1)

        if (this.invertX) {
          this.ndc.setComponent(0, -this.ndc.x)
        }

        if (this.invertY) {
          this.ndc.setComponent(1, -this.ndc.y)
        }

        this.ndc.multiplyScalar(this.scale)

        this.ndc.unproject(this.ctx.camera)

        const direction = this.ndc.sub(this.ctx.camera.position).normalize()
        const distance = -this.ctx.camera.position.z / direction.z
        const pos = this.ctx.camera.position.clone().add(direction.multiplyScalar(distance))

        gsap.to(this.object.position, {
          x: pos.x,
          y: pos.y,
          z: pos.z,
          duration: 0.3,
          ease: 'power2.out',
        })
      },
    })
  }

  handleResize(width, height) {
    this.canvasSize.set(width, height)
  }
}
