import { MeshBasicNodeMaterial } from 'three/webgpu'
import { ContextModule } from "three-start"
import {
  registerAll,
  createWorld,
  createWorldSettings,
  addBroadphaseLayer,
  addObjectLayer,
  enableCollision,
  updateWorld
} from "crashcat"
import { debugRenderer } from "crashcat/three"

export class PhysicsModule extends ContextModule {
  settings = null
  world = null

  BROADPHASE_LAYER_MOVING = null
  BROADPHASE_LAYER_NOT_MOVING = null

  OBJECT_LAYER_MOVING = null
  OBJECT_LAYER_NOT_MOVING = null

  onAwake() {
    registerAll()

    this.settings = createWorldSettings()

    this.BROADPHASE_LAYER_MOVING = addBroadphaseLayer(this.settings)
    this.BROADPHASE_LAYER_NOT_MOVING = addBroadphaseLayer(this.settings)

    this.OBJECT_LAYER_MOVING = addObjectLayer(this.settings, this.BROADPHASE_LAYER_MOVING)
    this.OBJECT_LAYER_NOT_MOVING = addObjectLayer(this.settings, this.BROADPHASE_LAYER_NOT_MOVING)

    enableCollision(this.settings, this.OBJECT_LAYER_MOVING, this.OBJECT_LAYER_NOT_MOVING)
    enableCollision(this.settings, this.OBJECT_LAYER_MOVING, this.OBJECT_LAYER_MOVING)

    this.world = createWorld(this.settings)

    this.createDebug()
  }

  onUpdate() {
    updateWorld(this.world, undefined, this.ctx.getDeltaTime())
    debugRenderer.update(this.debugRendererState, this.world)
  }

  createDebug() {
    const options = debugRenderer.createDefaultOptions()
    this.debugRendererState = debugRenderer.init(options)

    const debugMaterial = new MeshBasicNodeMaterial({ color: 0xff00ff, wireframe: true })

    this.debugRendererState.object3d.traverse(child => {
      if (child.isMesh || child.isLine) {
        child.material = debugMaterial
      }
    })

    this.ctx.scene.add(this.debugRendererState.object3d)
  }
}
