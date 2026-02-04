import * as THREE from 'three'
import Experience from '../Experience'

export default class Floor {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.floorGeometry = new THREE.CircleGeometry(5, 64)
  }
  setTextures() {
    this.textures = {}
    this.textures.color = this.resources.items.dirtColorTexture
    this.textures.color.colorSpace = THREE.SRGBColorSpace
    this.textures.color.repeat.set(1.5, 1.5)
    this.textures.color.wrapS = THREE.RepeatWrapping
    this.textures.color.wrapT = THREE.RepeatWrapping

    this.textures.normal = this.resources.items.dirtNormalTexture
    this.textures.color.repeat.set(1.5, 1.5)
    this.textures.color.wrapS = THREE.RepeatWrapping
    this.textures.color.wrapT = THREE.RepeatWrapping
  }
  setMaterial() {
    this.floorMaterial = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal
    })
  }
  setMesh() {
    this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial)
    this.floorMesh.rotation.x = -Math.PI/2
    this.floorMesh.receiveShadow = true
    this.scene.add(this.floorMesh)
  }
}
