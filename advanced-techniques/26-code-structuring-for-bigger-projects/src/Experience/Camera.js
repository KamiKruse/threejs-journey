import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from './Experience'
export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.size
    this.canvas = this.experience.canvas
    this.scene = this.experience.scene
    this.setCameraInstance()
    this.setOrbitControls()
  }
  setCameraInstance() {
    this.cameraInstance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.cameraInstance.position.set(6, 4, 8)
    this.scene.add(this.cameraInstance)
  }
  setOrbitControls() {
    this.orbitControlsInstance = new OrbitControls(
      this.cameraInstance,
      this.canvas
    )
    this.orbitControlsInstance.enableDamping = true
  }
  resize() {
    this.cameraInstance.aspect = this.sizes.width / this.sizes.height
    this.cameraInstance.updateProjectionMatrix()
  }
  update() {
    this.orbitControlsInstance.update()
  }
}
 