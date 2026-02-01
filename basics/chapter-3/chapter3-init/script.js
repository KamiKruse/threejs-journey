import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')


//Scene
const scene = new THREE.Scene()

//Objects
const geometry = new THREE.BoxGeometry(1,1,1)
const meshMaterial = new THREE.MeshBasicMaterial({color: 0xff0000})
const mesh = new THREE.Mesh(geometry, meshMaterial)
scene.add(mesh)

//Sizing
const screenSize = {
  width: 800,
  height: 600
}

//Camera
const camera = new THREE.PerspectiveCamera(75, screenSize.width / screenSize.height )
camera.position.z = 3
scene.add(camera)

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(screenSize.width, screenSize.height)
renderer.render(scene, camera)
