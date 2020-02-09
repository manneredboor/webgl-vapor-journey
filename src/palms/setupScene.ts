import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'

export const setupScene = () => {
  // Setup
  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas') as HTMLCanvasElement,
    antialias: true,
    alpha: true,
  })
  renderer.autoClear = false
  renderer.shadowMapEnabled = true
  renderer.shadowMapType = THREE.PCFSoftShadowMap
  renderer.setClearColor(0x200022, 0)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(WIDTH, HEIGHT)

  // Scene
  const scene = new THREE.Scene()

  // Camera
  const camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 4000)

  // Add light
  const light = new THREE.AmbientLight(0xee3355, 0.2)
  scene.add(light)

  // const sunSphere = new THREE.SphereGeometry(4000)

  // Sun Sphere
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xee1155,
    roughness: 1,
    metalness: 0,
  })
  const sunGeometry = new THREE.SphereGeometry(600, 20, 20)
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
  sunMesh.position.set(0, 0, -3600)
  scene.add(sunMesh)

  // Sun Light
  const sunLight = new THREE.PointLight(0xee3366, 0.6, 6000)
  sunLight.position.z = -1800
  sunLight.position.x = 0
  sunLight.position.y = 800
  sunLight.power = 240
  sunLight.decay = 0.01
  sunLight.castShadow = true

  // sun.intensity = 60
  // sun.raycast = true
  scene.add(sunLight)

  // Car Light
  const carLight = new THREE.PointLight(0xbb33ee, 1, 600)
  carLight.position.z = -10
  carLight.position.x = 0
  carLight.position.y = 50
  carLight.power = 8

  carLight.castShadow = true
  carLight.shadow.mapSize.width = 1024
  carLight.shadow.mapSize.height = 1024
  carLight.shadow.camera.near = 0.5
  carLight.shadow.camera.far = 1000
  // carLight.shadowDarkness = 0.5
  scene.add(carLight)

  // Plane
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf333f3 })
  const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100)
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = (-90 * Math.PI) / 180
  plane.position.y = -16
  plane.receiveShadow = true
  scene.add(plane)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new BloomPass(
    0.8, // strength
    25, // kernel size
    4, // sigma ?
    256, // blur render target resolution
  )
  composer.addPass(bloomPass)

  const filmPass = new FilmPass(
    0.6, // noise intensity
    0.02, // scanline intensity
    400, // scanline count
    0, // grayscale
  )
  filmPass.renderToScreen = true
  composer.addPass(filmPass)

  return { composer, renderer, camera, scene, WIDTH, HEIGHT, sunMesh }
}
