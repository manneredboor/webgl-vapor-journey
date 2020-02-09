import * as THREE from 'three'

// Setup
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  antialias: true,
})
renderer.setClearColor(0xdd33ee)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(WIDTH, HEIGHT)

// Camera and scene
const camera = new THREE.PerspectiveCamera(35, WIDTH / HEIGHT, 0.1, 3000)
const scene = new THREE.Scene()

// Add light
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)

const light1 = new THREE.PointLight(0xffffff, 0.5)
light1.position.z = -50
light1.position.x = 150
light1.position.y = 300
scene.add(light1)

// Materials
const material = new THREE.MeshStandardMaterial({
  color: 0x33f3f3,
  roughness: 0.5,
  metalness: 0.3,
})

const material1 = new THREE.MeshPhongMaterial({
  color: 0xf333f3,
  specular: 0xff00ff,
  shininess: 30,
})

const material2 = new THREE.MeshLambertMaterial({
  color: 0xf3f333,
  transparent: true,
  opacity: 0.9,
  // wireframe: true,
})

// const material4 = new THREE.MeshDepthMaterial()

const material3 = new THREE.SpriteMaterial({
  map: new THREE.TextureLoader().load(
    'https://media.giphy.com/media/5xaOcLO6z2g5Fq933B6/giphy.gif',
  ),
})

// Box
const geometry = new THREE.BoxGeometry(100, 100, 100)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(-100, 0, -1000)
scene.add(mesh)

// Sphere
const geometry1 = new THREE.SphereGeometry(30, 20, 20)
const mesh1 = new THREE.Mesh(geometry1, material1)
mesh1.position.set(0, -60, -360)
scene.add(mesh1)

// Knot
const knotGeo = new THREE.TorusKnotBufferGeometry(50, 8, 100, 100)
const knotMesh = new THREE.Mesh(knotGeo, material1)
knotMesh.position.set(100, 0, -1000)
scene.add(knotMesh)

// Plane
const geometry2 = new THREE.PlaneGeometry(10000, 10000, 100, 100)
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.rotation.x = (-90 * Math.PI) / 180
mesh2.position.y = -100
scene.add(mesh2)

// Sprite
const spriteMesh = new THREE.Sprite(material3)
spriteMesh.scale.set(200, 200, 200)
spriteMesh.position.set(0, 150, -1000)
scene.add(spriteMesh)

// Render
const render = () => {
  const now = Date.now()

  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  mesh.rotation.z += 0.01

  knotMesh.rotation.x -= 0.01
  knotMesh.rotation.y -= 0.01
  knotMesh.rotation.z -= 0.01
  // knotMesh.position.z -= 1

  // console.log((now % 1000) - 500)
  mesh2.position.x = now % 1000

  // console.log(now % 1000)

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

requestAnimationFrame(render)
