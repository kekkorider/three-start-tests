import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { ThreeStart, addComponent } from 'three-start';
import { MotionType } from 'crashcat'

import { gsap, Observer } from '../assets/js/gsap'

import { normalMaterial } from './materials/normal'

// import { floor } from './components/Floor'

import { Spin } from './behaviors/Spin'
import { TiltBody } from './behaviors/TiltBody'
import { FollowMouse } from './behaviors/FollowMouse'
import { BodyBox } from './behaviors/BodyBox'
import { BodySphere } from './behaviors/BodySphere'
import { BodyTriangle } from './behaviors/BodyTriangle'

import { PhysicsModule } from './modules/Physics'
import { AssetLoaderModule } from './modules/AssetLoader'

const starter = new ThreeStart()
starter.addModules({
  assetLoader: new AssetLoaderModule(),
  physics: new PhysicsModule()
})
const { scene, camera, renderer, modules } = starter.ctx

camera.position.y = 0.5
camera.position.z = 1.3

starter.start()
starter.mount(document.getElementById('app'))

const models = await modules.assetLoader.loadModels(['/mazes.glb'])
models[0].scene.name = 'Maze'
models[0].scene.traverse(child => {
  if (child.isMesh) {
    child.material = normalMaterial
  }
})
scene.add(models[0].scene)
addComponent(models[0].scene.children[1], BodyTriangle, MotionType.KINEMATIC)
addComponent(models[0].scene.children[1], TiltBody)

const controls = new OrbitControls(camera, renderer.domElement)

function createCube() {
  const w = gsap.utils.random(0.03, 0.08)
  const h = gsap.utils.random(0.03, 0.08)
  const d = gsap.utils.random(0.03, 0.08)

  const cube = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), normalMaterial)
  cube.position.x = gsap.utils.random(-0.5, 0.5)
  cube.position.y = gsap.utils.random(0.1, 0.15)
  cube.position.z = gsap.utils.random(-0.3, 0.3)
  cube.rotation.y = gsap.utils.random(0, Math.PI * 2)
  cube.rotation.z = gsap.utils.random(0, Math.PI * 2)

  addComponent(cube, BodyBox, MotionType.DYNAMIC)
  scene.add(cube)
}

function createSphere() {
  const radius = gsap.utils.random(0.03, 0.08)

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), normalMaterial)
  sphere.position.x = gsap.utils.random(-0.5, 0.5)
  sphere.position.y = gsap.utils.random(0.1, 0.15)
  sphere.position.z = gsap.utils.random(-0.3, 0.3)

  addComponent(sphere, BodySphere, MotionType.DYNAMIC)
  scene.add(sphere)
}

const actions = [
  createCube,
  createSphere,
]

Observer.create({
  type: 'pointer',
  target: starter.ctx.canvasContainer,
  onClick: () => {
    // return
    gsap.utils.random(actions)()
  }
})

// floor.position.y = -2

// scene.add(floor)
