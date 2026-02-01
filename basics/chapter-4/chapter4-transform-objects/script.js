import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

//Objects
const geometry = new THREE.BoxGeometry(1, 1, 1)
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, meshMaterial)
// scene.add(mesh)

//Sizing
const screenSize = {
  width: 800,
  height: 600,
}

const val = mesh.position.length()
console.log(val)
mesh.position.normalize()

const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.set(2, 0, 0)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.set(-2, 0, 0)

group.add(cube1)
group.add(cube2)
group.add(cube3)

group.position.x = -0.5
group.rotation.y = 1
group.scale.y = 2

const axes = new THREE.AxesHelper(2)
scene.add(axes)
//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  screenSize.width / screenSize.height
)
camera.position.z = 3
scene.add(camera)

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(screenSize.width, screenSize.height)
renderer.render(scene, camera)
