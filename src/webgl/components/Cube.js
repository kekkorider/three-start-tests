import * as THREE from 'three/webgpu'
import { addComponent } from 'three-start'

import { Spin } from '../behaviors/Spin'
import { FollowMouse } from '../behaviors/FollowMouse'

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshNormalNodeMaterial()

const cube = new THREE.Mesh(geometry, material)
addComponent(cube, Spin, 'x', 1)
addComponent(cube, Spin, 'z', 0.6)
addComponent(cube, FollowMouse, 1, true, true)

export {
  cube,
}
