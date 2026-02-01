import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui
  .add(global, 'envMapIntensity')
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

//Directional Lights
const directionalLights = new THREE.DirectionalLight('#ffffff', 1)
directionalLights.position.set(3, 7, 6)
scene.add(directionalLights)

directionalLights.castShadow = true
directionalLights.shadow.camera.far = 15
directionalLights.shadow.mapSize.set(1024, 1024)
directionalLights.target.position.set(0, 4, 0)
directionalLights.target.updateWorldMatrix()
directionalLights.shadow.bias = 0.002
directionalLights.shadow.normalBias = 0.05
gui.add(directionalLights, 'castShadow')
gui.add(directionalLights.shadow, 'bias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLights.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui
  .add(directionalLights, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('Light_Intensity')
gui
  .add(directionalLights.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('LightX')
gui
  .add(directionalLights.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('LightY')
gui
  .add(directionalLights.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('LightZ')

//DirectionalLights Helper
const directionalLightsCameraHelper = new THREE.CameraHelper(
  directionalLights.shadow.camera
)
scene.add(directionalLightsCameraHelper)

// const axesHelper = new THREE.AxesHelper(20)
// scene.add(axesHelper)

//Textures

const groundDiffuse = textureLoader.load(
  '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg'
)
groundDiffuse.colorSpace = THREE.SRGBColorSpace
const groundNormal = textureLoader.load(
  '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png'
)
const groundARM = textureLoader.load(
  '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg'
)

const backWallDiffuse = textureLoader.load(
  '/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg'
)
backWallDiffuse.colorSpace = THREE.SRGBColorSpace
const backWallNormal = textureLoader.load(
  '/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png'
)
const backWallARM = textureLoader.load(
  '/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg'
)
/**
 * Models
 */
// Helmet
// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
//   gltf.scene.scale.set(10, 10, 10)
//   scene.add(gltf.scene)

//   updateAllMaterials()
// })

//Simons Burger
gltfLoader.load('/models/hamburger.glb', (gltf) => {
  gltf.scene.scale.set(0.4, 0.4, 0.4)
  gltf.scene.position.set(0,4,0)
  scene.add(gltf.scene)

  updateAllMaterials()
})
const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: groundDiffuse,
    normalMap: groundNormal,
    aoMap: groundARM,
    roughnessMap: groundARM,
    metalnessMap: groundARM,
    aoMapIntensity: 1,
  })
)
groundMesh.receiveShadow = true
groundMesh.rotation.set(-Math.PI / 2, 0, 0)
scene.add(groundMesh)

const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: backWallDiffuse,
    normalMap: backWallNormal,
    aoMap: backWallARM,
    roughnessMap: backWallARM,
    metalnessMap: backWallARM,
    aoMapIntensity: 1,
  })
)
backWall.position.set(0, 4, -4)
scene.add(backWall)
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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//Tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
