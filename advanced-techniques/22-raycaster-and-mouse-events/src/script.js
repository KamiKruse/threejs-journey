import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

// scene.add(object1, object2, object3)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight('#ffffff', 2)
scene.add(ambientLight)

/**
 * GLTF Loader
 */
const gltfloader = new GLTFLoader()
let model = null
gltfloader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
  model = gltf.scene
  scene.add(model)
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
 * Cursor
 */
let cursor = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / sizes.width) * 2 - 1
  cursor.y = -(event.clientY / sizes.height) * 2 + 1
})
window.addEventListener('click', () => {
  if (currentIntersects) {
    switch (currentIntersects.object) {
      case object1:
        console.log('clicked object1')
        break
      case object2:
        console.log('clicked object2')
        break
      case object3:
        console.log('clicked object3')
        break
    }
  }
})
/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(1, 0, 0)
rayDirection.normalize()
let currentIntersects = null
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

  const objectsToTest = [object1, object2, object3]

  raycaster.setFromCamera(cursor, camera)
  const intersects = raycaster.intersectObjects(objectsToTest)
  for (const object of objectsToTest) {
    object.material.color.set('#ff0000')
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set('#0000ff')
  }

  //   if (intersects.length) {
  //     if (currentIntersects === null) {
  //       console.log('mouse enter')
  //     }
  //     currentIntersects = intersects[0]
  //   } else {
  //     if (currentIntersects) {
  //       console.log('mouse leave')
  //     }
  //     currentIntersects = null
  //   }
  if (model) {
    const modelIntersect = raycaster.intersectObject(model)
    if (modelIntersect.length) {
      model.scale.set(1.5, 1.5, 1.5)
    } else {
      model.scale.set(1, 1, 1)
    }
  }
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
