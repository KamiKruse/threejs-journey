import * as THREE from 'three'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'

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
    this.camera = new Camera()
    this.scene = new THREE.Scene()

    //resizing the window
    this.size.on('resize', () => {
      this.resize()
    })

    //tick function
    this.time.on('tick', () => {
      this.update()
    })
  }
  resize() {}
  update() {}
}
