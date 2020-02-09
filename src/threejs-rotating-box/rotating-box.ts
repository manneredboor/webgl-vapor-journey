import * as THREE from 'three'

// Setup
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  antialias: true,
})
renderer.setClearColor(0x00ff00)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(WIDTH, HEIGHT)

// Camera and scene
const camera = new THREE.PerspectiveCamera(35, WIDTH / HEIGHT, 0.1, 3000)
const scene = new THREE.Scene()

// Add light
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)

const light1 = new THREE.PointLight(0xffffff, 0.5)
scene.add(light1)

// Add box
const geometry = new THREE.BoxGeometry(100, 100, 100)
const material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 0, -1000)
scene.add(mesh)

// Render
const render = () => {
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  mesh.rotation.z += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

requestAnimationFrame(render)
