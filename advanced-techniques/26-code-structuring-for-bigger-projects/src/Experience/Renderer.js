import * as THREE from 'three'
import Experience from './Experience'
export default class Renderer {
  constructor() {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.size = this.experience.size

    this.setRendererInstance()
  }
  setRendererInstance() {
    this.rendererInstance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.rendererInstance.toneMapping = THREE.CineonToneMapping
    this.rendererInstance.toneMappingExposure = 1.75
    this.rendererInstance.shadowMap.enabled = true
    this.rendererInstance.shadowMap.type = THREE.PCFSoftShadowMap
    this.rendererInstance.setClearColor('#211d20')
    this.rendererInstance.setSize(this.size.width, this.size.height)
    this.rendererInstance.setPixelRatio(this.size.pixelRatio)
  }
  resize() {
    this.rendererInstance.setSize(this.size.width, this.size.height)
    this.rendererInstance.setPixelRatio(this.size.pixelRatio)
  }
  update() {
    this.rendererInstance.render(this.scene, this.camera.cameraInstance)
  }
}
