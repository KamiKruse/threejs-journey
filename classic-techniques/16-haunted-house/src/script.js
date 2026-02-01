import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorBaseColor = textureLoader.load('/textures/door/color.jpg')
doorBaseColor.colorSpace = THREE.SRGBColorSpace
const doorAlpha = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const doorHeight = textureLoader.load('/textures/door/height.jpg')
const doorMetalness = textureLoader.load('/textures/door/metalness.jpg')
const doorNormal = textureLoader.load('/textures/door/normal.jpg')
const doorRoughness = textureLoader.load('/textures/door/roughness.jpg')

const bricksBaseColor = textureLoader.load('/textures/bricks/color.jpg')
bricksBaseColor.colorSpace = THREE.SRGBColorSpace
const bricksAmbientOcclusion = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
)
const bricksNormal = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughness = textureLoader.load('/textures/bricks/roughness.jpg')

const grassBaseColor = textureLoader.load('/textures/grass/color.jpg')
grassBaseColor.colorSpace = THREE.SRGBColorSpace
const grassAmbientOcclusion = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
)
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')

grassBaseColor.repeat.set(8, 8)
grassAmbientOcclusion.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)

grassBaseColor.wrapS = THREE.RepeatWrapping
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping

grassBaseColor.wrapT = THREE.RepeatWrapping
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping
/**
 * House
 */
//Group
const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksBaseColor,
    normalMap: bricksNormal,
    aoMap: bricksAmbientOcclusion,
    aoMapIntensity: 4,
    roughnessMap: bricksRoughness,
  })
)
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)


walls.position.y = 1.25
house.add(walls)

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.2, 1.5, 4),
  new THREE.MeshStandardMaterial({ color: '#b2b1c6' })
)

roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI / 4
house.add(roof)

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorBaseColor,
    transparent: true,
    alphaMap: doorAlpha,
    normalMap: doorNormal,
    aoMap: doorAmbientOcclusion,
    aoMapIntensity: 4,
    displacementMap: doorHeight,
    displacementScale: 0.1,
    roughnessMap: doorRoughness,
    metalnessMap: doorMetalness,
  })
)
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.z = 2 + 0.01
door.position.y = 1
house.add(door)

const bushGeometry = new THREE.SphereGeometry()
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#89c854',
})

//At the end uncomment to get the right set of bushes. Use the manual way of bushes first
// const bushPositions = [
//   { x: -1.5, y:0.1, z: 2.4 },
//   { x: -1, y:0.1, z: 2.4 },
//   { x: 1, y:0.1, z: 2.4 },
//   { x: 1.4, y:0.1, z: 2.4 },
//   { x: 2, y:0.1, z: 2.4 },
// ]

// for(let i=0; i< 5; i++){
//     const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial)
//     bushMesh.position.x = bushPositions[i].x
//     bushMesh.position.y = bushPositions[i].y
//     bushMesh.position.z = bushPositions[i].z

//     const scale = Math.random() * 0.5 + 0.1
//     bushMesh.scale.set(scale, scale, scale)
//     house.add(bushMesh)
// }

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)


bush1.position.x = 1.8
bush1.position.z = 2.3
bush1.scale.set(0.5, 0.5, 0.5)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)


bush2.position.x = -1.8
bush2.position.z = 2.3
bush2.scale.set(0.5, 0.5, 0.5)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)


bush3.position.x = 1
bush3.position.z = 2.3
bush3.scale.set(0.5, 0.5, 0.5)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)


bush4.position.x = -1
bush4.position.z = 2.3
bush4.scale.set(0.5, 0.5, 0.5)

house.add(bush1, bush2, bush3, bush4)

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  color: '#b2b6b1',
})

for (let i = 0; i < 50; i++) {
  const graveMesh = new THREE.Mesh(graveGeometry, graveMaterial)
  graveMesh.castShadow = true
  const angle = Math.random() * Math.PI * 2
  const radius = 5 + Math.random() * 4
  graveMesh.position.x = Math.sin(angle) * radius
  graveMesh.position.y = 0.4
  graveMesh.position.z = Math.cos(angle) * radius

  graveMesh.rotation.y = (Math.random() - 0.5) * 0.4
  graveMesh.rotation.z = (Math.random() - 0.5) * 0.4
  graves.add(graveMesh)
}
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassBaseColor,
    normalMap: grassNormal,
    aoMap: grassAmbientOcclusion,
    aoMapIntensity: 4,
    roughnessMap: grassRoughness,
  })
)
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)

moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

//Point Light
const doorLight = new THREE.PointLight('#ff7d46', 5, 20)

doorLight.position.set(0, 2.2, 3.2)
house.add(doorLight)

//Ghost Lights
const ghost1 = new THREE.PointLight('#ff0000', 2, 3)

scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ff00', 2, 3)

scene.add(ghost2)

const ghost3 = new THREE.PointLight('#0000ff', 2, 3)

scene.add(ghost3)
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
camera.position.y = 2
camera.position.z = 2.5
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
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace


/**
 * Shadows
 */

//Casters
roof.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

//Receivers
walls.receiveShadow = true
door.receiveShadow = true
bush1.receiveShadow = true
bush2.receiveShadow = true
bush3.receiveShadow = true
bush4.receiveShadow = true
floor.receiveShadow = true

//Shadow Details
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.width = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.width = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.width = 256
ghost3.shadow.camera.far = 7
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //Update Ghosts
  const angle1 = elapsedTime * 0.5

  ghost1.position.x = Math.sin(angle1) * 4
  ghost1.position.z = Math.cos(angle1) * 4
  ghost1.position.y = Math.sin(angle1 * 3)

  const angle2 = elapsedTime * 0.32
  ghost2.position.x = -Math.sin(angle2) * 5
  ghost2.position.z = Math.cos(angle2) * 5
  ghost2.position.y = Math.sin(angle2 * 4) + Math.sin(elapsedTime * 2.5)

  const angle3 = elapsedTime * 0.18
  ghost3.position.x = -Math.sin(angle3) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.cos(angle3) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(angle3 * 5) + Math.sin(elapsedTime * 2.5)
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
