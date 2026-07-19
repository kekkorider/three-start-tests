import * as THREE from 'three/webgpu';
import { ThreeStart } from 'three-start';

import { cube } from './components/Cube'

const starter = new ThreeStart()
const { scene, camera } = starter.ctx

camera.position.z = 5

starter.start()
starter.mount(document.getElementById('app'))

scene.add(cube)
