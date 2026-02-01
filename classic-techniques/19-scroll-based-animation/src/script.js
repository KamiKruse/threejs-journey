import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
  materialColor: '#ffeded',
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Cursor
 */
let cursor = { x: 0, y: 0 }

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradientMap = textureLoader.load('/textures/gradients/3.jpg')
gradientMap.magFilter = THREE.NearestFilter

/**
 * Meshes
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientMap,
})
const objectDistance = 4
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
mesh1.position.set(2, 0, 0)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
mesh2.position.set(-2, 0, 0)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)
mesh3.position.set(1.5, 0, 0)
scene.add(mesh1, mesh2, mesh3)

mesh1.position.y = -objectDistance * 0
mesh2.position.y = -objectDistance * 1
mesh3.position.y = -objectDistance * 2

let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY

  let newSection = Math.round(scrollY / sizes.height)
  if (newSection !== currentSection) {
    currentSection = newSection
    gsap.to(
      meshArray[currentSection].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x : '+=6',
        y : '+=3',
        z : '+=6'
      }
    )
  }
})

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

const meshArray = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
const count = 200
const particleGeo = new THREE.BufferGeometry()

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

for (let i = 0; i < count; i++) {
  const i3 = i * 3
  positions[i3] = (Math.random() - 0.5) * 10
  positions[i3 + 1] =
    objectDistance * 0.5 - Math.random() * objectDistance * meshArray.length
  positions[i3 + 2] = (Math.random() - 0.5) * 10

  const colorVal = new THREE.Color(parameters.materialColor)
  colors[i3] = colorVal.r
  colors[i3 + 1] = colorVal.g
  colors[i3 + 2] = colorVal.b
}
const particleMat = new THREE.PointsMaterial({
  vertexColors: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  size: 0.3,
  sizeAttenuation: true,
})

const points = new THREE.Points(particleGeo, particleMat)
scene.add(points)

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
  particleMat.color.set(parameters.materialColor)
})
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

gui.add(directionalLight.position, 'x').min(1).max(5).step(0.01)
gui.add(directionalLight.position, 'y').min(1).max(5).step(0.01)
gui.add(directionalLight.position, 'z').min(1).max(5).step(0.01)
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
  35,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 6
scene.add(camera)

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

cameraGroup.add(camera)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  camera.position.y = (-scrollY / sizes.height) * objectDistance

  let parallaxX = cursor.x * 0.5
  let parallaxY = -cursor.y * 0.5

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 5
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 5

  for (const mesh of meshArray) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.z += deltaTime * 0.12
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
