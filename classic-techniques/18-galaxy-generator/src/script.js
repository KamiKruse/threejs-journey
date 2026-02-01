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
 *Galaxy
 */
const parameters = {}
parameters.count = 1000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 6
parameters.spin = 1
parameters.randomness = 2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let particleGeo = new THREE.BufferGeometry()
let particleMat = new THREE.PointsMaterial()
let particleMesh = new THREE.Points(particleGeo, particleMat)

//Galaxy Generator
const generateGalaxy = () => {
  //Cleanup
  if (particleMesh !== null) {
    particleGeo.dispose()
    particleMat.dispose()
    scene.remove(particleMesh)
  }

  //Particle Geometry
  particleGeo = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const radius =
      Math.pow(Math.random(), parameters.randomness) * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2


    // const randomX =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1)
    // const randomY =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1)
    // const randomZ =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1)

    // 1. Calculate the spiral position (The Spine)
    const currentPoint = new THREE.Vector3(
      Math.cos(branchAngle + spinAngle) * radius,
      0,
      Math.sin(branchAngle + spinAngle) * radius
    )

    // 2. Calculate a random Offset using Spherical logic (The Cloud)
    // randomDirection: 0 to 2 PI
    // randomDistance: Use your power math here
    const randomAngle = Math.random() * Math.PI * 2
    const randomDistance =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness

    const randomOffset = new THREE.Vector3(
      Math.cos(randomAngle) * randomDistance,
      (Math.random() - 0.5) * randomDistance, // Y is simpler, just up/down
      Math.sin(randomAngle) * randomDistance
    )

    // positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    // positions[i3 + 1] = randomY
    // positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    positions[i3] = currentPoint.x + randomOffset.x
    positions[i3 + 1] = currentPoint.y + randomOffset.y
    positions[i3 + 2] = currentPoint.z + randomOffset.z

    //Colors
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  //Materials
  particleMat = new THREE.PointsMaterial()
  particleMat.size = parameters.size
  particleMat.sizeAttenuation = true
  particleMat.depthWrite = false
  particleMat.blending = THREE.AdditiveBlending
  particleMat.vertexColors = true

  particleMesh = new THREE.Points(particleGeo, particleMat)
  scene.add(particleMesh)
}
gui
  .add(parameters, 'count')
  .min(100)
  .max(100000)
  .step(1000)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'size')
  .min(0.01)
  .max(1)
  .step(0.01)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'radius')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'branches')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(3)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

generateGalaxy()

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
camera.position.x = 3
camera.position.y = 3
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
