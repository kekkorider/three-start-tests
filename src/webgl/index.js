import * as THREE from 'three/webgpu';
import { ThreeStart, addComponent } from 'three-start';

// import { cube } from './components/Cube'
import { normalMaterial } from './materials/normal'

import { Spin } from './behaviors/Spin'
import { FollowMouse } from './behaviors/FollowMouse'

const starter = new ThreeStart()
const { scene, camera } = starter.ctx

camera.position.z = 5

starter.start()
starter.mount(document.getElementById('app'))

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), normalMaterial)
addComponent(cube, Spin, 'x', 1)
addComponent(cube, Spin, 'z', 0.6)
addComponent(cube, FollowMouse, 1, false, false)

const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 0), normalMaterial)
addComponent(icosahedron, Spin, 'y', 0.3)
addComponent(icosahedron, FollowMouse, 0.5, false, true)

const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), normalMaterial)
addComponent(octahedron, Spin, 'x', 0.5)
addComponent(octahedron, Spin, 'y', 0.7)
addComponent(octahedron, FollowMouse, 0.15, true, false)

scene.add(cube)
scene.add(icosahedron)
scene.add(octahedron)
