import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// import typeFaceFont from '../static/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axes Helper
 */
const axes = new THREE.AxesHelper()
scene.add(axes)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load('/textures/matcaps/8.png')
matCapTexture.colorSpace = THREE.SRGBColorSpace
const material = new THREE.MeshMatcapMaterial()
material.matcap = matCapTexture

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  console.log(font)
  const textGeometry = new TextGeometry('Hello Vivek', {
    font,
    size: 0.5,
    height: 0.2,
    depth: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelOffset:0,
    bevelSegments:5,
    bevelSize: 0.02
  })
  textGeometry.center()
  // textGeometry.computeBoundingBox()
  // textGeometry.translate(
  //   - textGeometry.boundingBox.max.x * 0.5,
  //   - textGeometry.boundingBox.max.y * 0.5,
  //   - textGeometry.boundingBox.max.z * 0.5
  // )
  const textMesh = new THREE.Mesh(textGeometry, material)
  scene.add(textMesh)
})
const donutGeo = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
console.time('donut')
for (let i=0; i< 300; i++){
  const donutMesh = new THREE.Mesh(donutGeo, material)
  donutMesh.position.x = (Math.random() - 0.5) * 10
  donutMesh.position.y = (Math.random() - 0.5) * 10
  donutMesh.position.z = (Math.random() - 0.5) * 10

  donutMesh.rotation.x = Math.random() * Math.PI
  donutMesh.rotation.y = Math.random() * Math.PI

  const scale = Math.random()
  donutMesh.scale.set(scale, scale, scale)
  scene.add(donutMesh)
}
console.timeEnd('donut')

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// )
// scene.add(geometry)
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
