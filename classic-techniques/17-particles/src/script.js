import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/1.png')

/**
 * Particle
 */
//Geometry
// const particleGeo = new THREE.SphereGeometry(1,32,32)

//Simons version - best version compared to docs for performance
const particleGeometry = new THREE.BufferGeometry()
const count = 20000

const positions = new Float32Array(3 * count)
const colors = new Float32Array(3 * count)
const colorSet = new THREE.Color()

for (let i = 0; i < count; i++) {
  const i3 = i * 3
  positions[i3] = (Math.random() - 0.5) * 10
  positions[i3 + 1] = (Math.random() - 0.5) * 10
  positions[i3 + 2] = (Math.random() - 0.5) * 10

  const colorVal = Math.random()

  // colorSet.setRGB(colorVal, colorVal, colorVal)
  colorSet.setHSL(Math.random(), 0.5, 0.5)

  colors[i3] = colorSet.r
  colors[i3 + 1] = colorSet.g
  colors[i3 + 2] = colorSet.b
}

particleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

//Material
const particleMat = new THREE.PointsMaterial({
  alphaMap: particleTexture,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
})
particleMat.size = 0.1
particleMat.sizeAttenuation = true
//ParticleMesh
const particleMesh = new THREE.Points(particleGeometry, particleMat)
scene.add(particleMesh)

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
camera.position.z = 3
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
renderer.outputColorSpace = THREE.SRGBColorSpace

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //Update Particles
    // for(let i = 0; i< count; i++){
    //     const i3 = i * 3
    //     const x  = particleGeometry.attributes.position.array[i3]
    //     particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    // }

    // particleGeometry.attributes.position.needsUpdate = true
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
