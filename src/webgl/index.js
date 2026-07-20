import * as THREE from 'three/webgpu';
import { ThreeStart, addComponent } from 'three-start';
import { MotionType } from 'crashcat'

import { gsap, Observer } from '../assets/js/gsap'

// import { cube } from './components/Cube'
import { normalMaterial } from './materials/normal'

import { floor } from './components/Floor'

import { Spin } from './behaviors/Spin'
import { FollowMouse } from './behaviors/FollowMouse'
import { BodyBox } from './behaviors/BodyBox'

import { PhysicsModule } from './modules/Physics'

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

Observer.create({
  type: 'pointer',
  target: starter.ctx.canvasContainer,
  onClick: () => {
    createCube()
  }
})

// const cube = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.3), normalMaterial)
// cube.rotation.y = 0.3
// cube.rotation.z = 0.3
// cube.position.y = 0.5
// addComponent(cube, BodyBox, MotionType.DYNAMIC)
// addComponent(cube, Spin, 'x', 1)
// addComponent(cube, Spin, 'z', 0.6)
// addComponent(cube, FollowMouse, 1, false, false)

// const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), normalMaterial)
// addComponent(icosahedron, Spin, 'y', 0.3)
// addComponent(icosahedron, FollowMouse, 0.5, false, true)

// const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), normalMaterial)
// addComponent(octahedron, Spin, 'x', 0.5)
// addComponent(octahedron, Spin, 'y', 0.7)
// addComponent(octahedron, FollowMouse, 0.15, true, false)

floor.position.y = -2

// scene.add(cube)
// scene.add(icosahedron)
// scene.add(octahedron)
scene.add(floor)
