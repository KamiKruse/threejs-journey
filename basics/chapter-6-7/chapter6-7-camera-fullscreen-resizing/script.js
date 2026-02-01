import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')
const cursor = {
  x: 0,
  y:0
}

//Scene
const scene = new THREE.Scene()

//Objects
// const geometry = new THREE.BoxGeometry(1, 1, 1)
let count = 5000
const positions = new Float32Array(count * 3 * 3)
for(let i = 0; i < positions.length; i++){
  positions[i] = (Math.random() - 0.5) *  4
}
const positionsAttribute = new THREE.BufferAttribute(positions, 3)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionsAttribute)
const meshMaterial = new THREE.MeshBasicMaterial({
  color: 0xd8e3e8,
  wireframe: true,
})
const mesh = new THREE.Mesh(geometry, meshMaterial)
scene.add(mesh)

//Sizing
const screenSize = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const aspectRatio = screenSize.width / screenSize.height
const axes = new THREE.AxesHelper(2)
// scene.add(axes)

window.addEventListener("resize", ()=>{
  screenSize.width = window.innerWidth
  screenSize.height = window.innerHeight
  camera.aspect = screenSize.width/screenSize.height
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(screenSize.width, screenSize.height)
})

window.addEventListener("dblclick", ()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})
//Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
camera.position.z = 3
scene.add(camera)

//Controls
const control = new OrbitControls(camera, canvas)
control.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(screenSize.width, screenSize.height)


//Animation
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / screenSize.width - 0.5
  cursor.y = event.clientY / screenSize.height - 0.5
})

const clock = new THREE.Clock()

const tick = () => {
  
  const elapsedTime = clock.getElapsedTime()
  // mesh.rotation.y = elapsedTime
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 3
  // camera.lookAt(mesh.position)
  control.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
