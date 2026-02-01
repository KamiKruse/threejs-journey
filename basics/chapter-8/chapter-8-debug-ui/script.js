import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

const gui = new GUI({
  width: 300,
  title: 'Vivek\'s GUI',
})
const vivekTweaks = gui.addFolder('VivekTweaks')
const debugObj = {
  color: '#ff0000'
}
const canvas = document.querySelector('canvas.webgl')
const cursor = {
  x: 0,
  y:0
}

//Scene
const scene = new THREE.Scene()

//Objects

const geometry = new THREE.BoxGeometry(1, 1, 1)
const meshMaterial = new THREE.MeshBasicMaterial({color: debugObj.color, wireframe: true})
let mesh = new THREE.Mesh(geometry, meshMaterial)
scene.add(mesh)

vivekTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.1).name('elevation')
const wireframeController = vivekTweaks.add(meshMaterial, 'wireframe')

vivekTweaks.add(mesh, 'visible').onChange((value) => {
  if(value) {
    wireframeController.show()
  } else {
    wireframeController.hide()
  }
})

vivekTweaks.addColor(debugObj, 'color').onChange(() => {
  meshMaterial.color.set(debugObj.color)
})

debugObj.spin = () => {
  gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2})
}
vivekTweaks.add(debugObj, "spin")

debugObj.subdivision = 2
vivekTweaks.add(debugObj, 'subdivision').min(1).max(10).step(1).onFinishChange(()=>{
  mesh.geometry.dispose()
  mesh.geometry = new THREE.BoxGeometry(
    1,
    1,
    1,
    debugObj.subdivision,
    debugObj.subdivision,
    debugObj.subdivision
  )
})

window.addEventListener("keydown", (event)=> {
  if(event.key === 'h'){
    gui.show(gui._hidden)
  }
})
//Sizing
const screenSize = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const aspectRatio = screenSize.width / screenSize.height
const axes = new THREE.AxesHelper(2)
scene.add(axes)

window.addEventListener("resize", ()=>{
  screenSize.width = window.innerWidth
  screenSize.height = window.innerHeight
  camera.aspect = screenSize.width/screenSize.height
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(screenSize.width, screenSize.height)
})

//Disabled resizing to help with Debug UI lesson
// window.addEventListener("dblclick", ()=>{
//   if(!document.fullscreenElement){
//     canvas.requestFullscreen()
//   } else {
//     document.exitFullscreen()
//   }
// })
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
