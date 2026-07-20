import { BoxGeometry, Mesh } from 'three/webgpu'
import { addComponent } from 'three-start'
import { MotionType } from 'crashcat'

import { normalMaterial } from '../materials/normal'
import { BodyBox } from '../behaviors/BodyBox'
import { TiltBody } from '../behaviors/TiltBody'

const geometry = new BoxGeometry(10, 1, 10)

const floor = new Mesh(geometry, normalMaterial)
addComponent(floor, BodyBox, MotionType.KINEMATIC)
addComponent(floor, TiltBody, 0.6)

export {
  floor,
}
