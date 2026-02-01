import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'



const debug = new GUI({
  width: 300,
  title: 'Material Debug',
})

const debugObj = {}
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

//Textures

const textureManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(textureManager)
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')

const matcap1 = textureLoader.load('/textures/matcaps/5.png')
const gradient1 = textureLoader.load('/textures/gradients/3.jpg')
gradient1.magFilter = THREE.NearestFilter
gradient1.minFilter = THREE.NearestFilter
gradient1.generateMipmaps = false

doorColorTexture.colorSpace = THREE.SRGBColorSpace
const normalMat = new THREE.MeshNormalMaterial()

matcap1.colorSpace = THREE.SRGBColorSpace

// Scene
const scene = new THREE.Scene()

//Geometries
const planeGeo = new THREE.PlaneGeometry(1, 1)
const sphereGeo = new THREE.SphereGeometry(1, 16, 8)
const torusGeo = new THREE.TorusGeometry()


//Materials
// const planeBasicMaterial = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   side: THREE.DoubleSide,
//   wireframe: true,
// })
// const sphereBasicMaterial = new THREE.MeshBasicMaterial({
//   // color: 0x00ff00,
//   wireframe: false,
// })
// sphereBasicMaterial.map = doorColorTexture
// sphereBasicMaterial.color = new THREE.Color(0x00ff00)

// const torusBasicMaterial = new THREE.MeshBasicMaterial({
//   color: 0x0000ff,
//   wireframe: true,
// })

// const torusBasicMaterial = new THREE.MeshNormalMaterial({
//   wireframe: true
// })
// const sphereBasicMaterial = new THREE.MeshNormalMaterial({
//   wireframe: true,
// })
// const planeBasicMaterial = new THREE.MeshNormalMaterial({
//   wireframe: true,
// })

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcap1

// const material = new THREE.MeshLambertMaterial()
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradient1

const material = new THREE.MeshStandardMaterial()
debugObj.standard = material
debugObj.standard.roughness = 0.5
debugObj.standard.metalness = 0.5

const standardMaterial = debug.addFolder('Standard Material')

standardMaterial
  .add(debugObj.standard, 'roughness')
  .name('roughness')
  .min(0)
  .max(1)
  .step(0.0001)

standardMaterial
  .add(debugObj.standard, 'metalness')
  .name('metalness')
  .min(0)
  .max(1)
  .step(0.0001)

//Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)


//Environment Map

const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
}) 

//Mesh Instantiation
const planeMesh = new THREE.Mesh(planeGeo, material)
const sphereMesh = new THREE.Mesh(sphereGeo, material)
const torusMesh = new THREE.Mesh(torusGeo, material)

scene.add(planeMesh, sphereMesh, torusMesh)
planeMesh.position.set(2, 0, 0)
torusMesh.position.set(-3, 0, 0)

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

  //Object Rotation
  sphereMesh.rotation.y = 0.1 * elapsedTime
  torusMesh.rotation.y = 0.1 * elapsedTime
  planeMesh.rotation.y = 0.1 * elapsedTime

  sphereMesh.rotation.x = -0.15 * elapsedTime
  torusMesh.rotation.x = -0.15 * elapsedTime
  planeMesh.rotation.x = -0.15 * elapsedTime
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
