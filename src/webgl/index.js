import * as THREE from 'three/webgpu';
import { ThreeStart, addComponent } from 'three-start';
import { MotionType } from 'crashcat'

import { gsap, Observer } from '../assets/js/gsap'

import { normalMaterial } from './materials/normal'

import { floor } from './components/Floor'

import { Spin } from './behaviors/Spin'
import { FollowMouse } from './behaviors/FollowMouse'
import { BodyBox } from './behaviors/BodyBox'
import { BodySphere } from './behaviors/BodySphere'

import { PhysicsModule } from './modules/Physics'

import { createMaze } from '../maze'

const maze = createMaze({
  width: 10,
  height: 10,
  cellShape: 'square',
  algorithm: 'recursiveBacktrack',
  seed: 42,
})

console.log(maze)

const starter = new ThreeStart()
starter.addModules({
  physics: new PhysicsModule()
})
const { scene, camera } = starter.ctx

camera.position.z = 5

starter.start()
starter.mount(document.getElementById('app'))

function createCube() {
  const w = gsap.utils.random(0.2, 0.6)
  const h = gsap.utils.random(0.4, 0.8)
  const d = gsap.utils.random(0.2, 0.4)

  const cube = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), normalMaterial)
  cube.position.x = gsap.utils.random(-2, 2)
  cube.position.y = gsap.utils.random(1, 2)
  cube.position.z = gsap.utils.random(-0.5, 0.5)
  cube.rotation.y = gsap.utils.random(0, Math.PI * 2)
  cube.rotation.z = gsap.utils.random(0, Math.PI * 2)

  addComponent(cube, BodyBox, MotionType.DYNAMIC)
  scene.add(cube)
}

function createSphere() {
  const radius = gsap.utils.random(0.1, 0.4)

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), normalMaterial)
  sphere.position.x = gsap.utils.random(-2, 2)
  sphere.position.y = gsap.utils.random(1, 2)
  sphere.position.z = gsap.utils.random(-0.5, 0.5)

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
    gsap.utils.random(actions)()
  }
})

floor.position.y = -2

scene.add(floor)
