import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js'
import GUI from 'lil-gui'

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

//Update Materials
const updateMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity
    }
  })
}

//Loaders
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Environment Maps
 */
//BG bluriness and intensity
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)

//Global Intensity
global.envMapIntensity = 1
gui
  .add(global, 'envMapIntensity')
  .min(1)
  .max(10)
  .step(0.1)
  .onChange(updateMaterials)

//LDR
// const environmentMaps = cubeTextureLoader.load([
//   '/environmentMaps/0/px.png',
//   '/environmentMaps/0/nx.png',
//   '/environmentMaps/0/py.png',
//   '/environmentMaps/0/ny.png',
//   '/environmentMaps/0/pz.png',
//   '/environmentMaps/0/nz.png',
// ])

// scene.environment = environmentMaps
// scene.background = environmentMaps

//HDR
// rgbeLoader.load('/environmentMaps/blender-2k.hdr', (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping
//   // scene.background = environmentMap
//   scene.environment = environmentMap
// })

//JPG
// const envMap = textureLoader.load(
//   '/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg'
// )
// envMap.mapping = THREE.EquirectangularReflectionMapping
// envMap.colorSpace = THREE.SRGBColorSpace
// scene.background = envMap
// scene.environment = envMap

//Ground Project Skybox
// rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap)=>{

//   environmentMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.environment = environmentMap

//   //Skybox
//   const skybox = new GroundProjectedSkybox(environmentMap)
//   skybox.scale.setScalar(50)
//   scene.add(skybox)

//   gui.add(skybox, 'radius').min(1).max(200).step(0.1).name('skyBoxRadius')
//   gui.add(skybox, 'height').min(1).max(200).step(0.1).name('skyBoxHeight')
// })

//LDR Realtime
const envMap = textureLoader.load(
  '/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg'
)
envMap.mapping = THREE.EquirectangularReflectionMapping
envMap.colorSpace = THREE.SRGBColorSpace
scene.background = envMap

/**
 * Lights
 */
// const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
// directionalLight.position.set(2, 2, 3)
// scene.add(directionalLight)
// console.log(directionalLight)

// const ambient = new THREE.AmbientLight(0xffffff, 5)
// scene.add(ambient)
// console.log(ambient)
/**
 * Meshes
 */
//Torus Knot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xaaaaaa,
  })
)
torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)

//Holy Donut
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(10, 0.5, 12, 64),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
)
holyDonut.position.set(-2, 3, 0)
holyDonut.layers.enable(1)
scene.add(holyDonut)

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType,
})
scene.environment = cubeRenderTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)
/**
 * GLTF
 */
let model = null
const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10)
  scene.add(gltf.scene)
  updateMaterials()
})

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
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime()

  //HolyDonutRotation
  if (holyDonut) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2
  }

  cubeCamera.update(renderer, scene)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
