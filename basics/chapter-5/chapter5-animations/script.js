import * as THREE from 'three'
import gsap from 'gsap'

const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

//Objects
const geometry = new THREE.BoxGeometry(1, 1, 1)
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, meshMaterial)
scene.add(mesh)

//Sizing
const screenSize = {
  width: 800,
  height: 600,
}

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


//Animation

// let time = Date.now()
// const clock = new THREE.Clock()
gsap.to(mesh.position, {x: 2, duration: 2})
gsap.to(mesh.position, {x: 0, duration: 2, delay: 1})



const tick = () => {
  // const currentTime = Date.now()
  // const deltaTime = currentTime - time
  // time = currentTime
  // const elapsedTime = clock.getElapsedTime()
  // camera.position.y = Math.sin(elapsedTime)
  // camera.position.x = Math.cos(elapsedTime)
  // camera.lookAt(mesh.position)
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
