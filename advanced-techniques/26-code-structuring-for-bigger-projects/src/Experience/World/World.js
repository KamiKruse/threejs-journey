import * as THREE from 'three'
import Experience from "../Experience";
import Environment from "../World/Environment";

export default class World {
  constructor(){
    this.experience = new Experience
    this.scene = this.experience.scene
    this.setWorld()
    this.environment = new Environment()
  }
  setWorld(){
    this.boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial())
    this.scene.add(this.boxMesh)
  }
  
}
