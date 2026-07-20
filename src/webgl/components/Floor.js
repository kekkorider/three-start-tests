import { BoxGeometry, Mesh } from 'three/webgpu'
import { addComponent } from 'three-start'

import { normalMaterial } from '../materials/normal'
import { BodyBox } from '../behaviors/BodyBox'

const geometry = new BoxGeometry(10, 1, 10)

const floor = new Mesh(geometry, normalMaterial)
addComponent(floor, BodyBox)

export {
  floor,
}
