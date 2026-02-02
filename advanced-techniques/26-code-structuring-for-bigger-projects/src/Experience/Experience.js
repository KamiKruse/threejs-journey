import * as THREE from 'three'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'

let instance = null
export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance
    }
    instance = this

    //global access
    window.experience = this

    //options
    this.canvas = canvas

    //setup
    this.size = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    //resizing the window
    this.size.on('resize', () => {
      this.resize()
    })

    //tick function
    this.time.on('tick', () => {
      this.update()
    })
  }
  resize() {
    this.camera.resize()
    this.renderer.resize()
  }
  update() {
    this.camera.update()
    this.renderer.update()
  }
}
