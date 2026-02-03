import EventEmitter from './EventEmitter'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
export default class Resources extends EventEmitter {
  constructor(sources) {
    super()
    //options
    this.sources = sources

    //setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
  }
  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    this.loaders.textureLoader = new THREE.TextureLoader()
  }
}
