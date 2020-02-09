import * as THREE from 'three'
import { setupScene } from './setupScene'
import { loadModels } from './models'
import { random, minmax, narrow } from './helpers'
import { easing } from 'ts-easing'

const PALM_ROTATE_SPEED = 0.003
const PALM_STEP = 80
const PALM_START = -3000

const MOVE_SPEED = 0.269
const ACCELERATION = 0.03
const MIN_VELOCITY = 0.3
const MAX_VELOCITY = 1

const main = async () => {
  const {
    composer,
    renderer,
    camera,
    scene,
    sunMesh,
    WIDTH,
    HEIGHT,
  } = setupScene()
  const { plant, palm, elephant, alien } = await loadModels()

  // Elephant
  // const material = new THREE.MeshStandardMaterial({ color: 0x030303 })
  elephant.position.set(400, 80, -800)
  elephant.rotation.y = -40
  scene.add(elephant)

  // Alien
  alien.position.set(-400, -25, -800)
  alien.rotation.y = 26
  scene.add(alien)

  // State
  const state = {
    mouseX: 0,
    mouseY: 0,
    accCoeff: 0,
    velocity: 0,
    velocityRounded: 0,
    palms: [] as THREE.Object3D[][],
  }

  // Plant
  plant.position.set(0, -11, -40)
  scene.add(plant)

  // Palms
  const createPalm = (x: number, z: number = PALM_START) => {
    const newPalm = palm.clone()
    newPalm.position.set(x, -40, z)
    newPalm.rotation.y = random(0, 360)
    scene.add(newPalm)
    return newPalm
  }
  const createPalmsPair = (z?: number) => {
    state.palms.push([createPalm(-50, z), createPalm(50, z)])
  }
  const initPalms = () => {
    for (let z = 0; z >= PALM_START; z -= PALM_STEP) {
      createPalmsPair(z)
    }
  }

  // Mouse
  const HALF_WIDTH = WIDTH / 2
  const HALF_HEIGHT = HEIGHT / 2
  document.addEventListener('mousemove', e => {
    // Mouse coordinates
    state.mouseX = e.pageX - HALF_WIDTH
    state.mouseY = e.pageY - HALF_HEIGHT

    // Calc acceleration coefficent
    state.accCoeff =
      (easing.outSine(narrow(0.3, 0.9, e.pageY / HEIGHT)) - 0.5) * 2

    // Move camera
    camera.position.y = state.mouseY * -0.004
    camera.position.x = state.mouseX * 0.02
  })

  // Render
  let prev = 0
  let prevThrottled = 0
  const render = (now: number) => {
    // now *= 0.001;  // convert to seconds
    const step = now - prev

    // Acceleration and velocity calculation
    const resistance =
      state.accCoeff > 0
        ? MAX_VELOCITY - state.velocity
        : state.velocity - MIN_VELOCITY
    state.velocity = minmax(
      MIN_VELOCITY,
      state.velocity + ACCELERATION * state.accCoeff * resistance,
      MAX_VELOCITY,
    )

    // Update camera fov according with acceleration
    const newVelocityRounded = Math.round(state.velocity * 100) / 100
    if (newVelocityRounded !== state.velocityRounded) {
      state.velocityRounded = newVelocityRounded
      camera.fov = 35 + 15 * state.velocityRounded
      camera.updateProjectionMatrix()

      const sunScale = newVelocityRounded + 1
      sunMesh.scale.set(sunScale, sunScale, sunScale)

      elephant.position.y = sunScale * 75
      elephant.position.x = sunScale * 300
      elephant.scale.set(sunScale * 2.6, sunScale * 2.6, sunScale * 2.6)

      alien.position.y = sunScale * -180
      alien.position.x = sunScale * -300
      alien.scale.set(sunScale * 2.6, sunScale * 2.6, sunScale * 2.6)
    }

    // Move plant
    plant.rotation.y += 0.01
    plant.position.x = state.mouseX / 25

    // Move palms
    const { palms } = state
    for (let i = 0; i < palms.length; i++) {
      const [p1, p2] = palms[i]
      p1.rotation.y += PALM_ROTATE_SPEED * state.velocity * step
      p1.position.z += MOVE_SPEED * state.velocity * step
      p2.rotation.y -= PALM_ROTATE_SPEED * state.velocity * step
      p2.position.z += MOVE_SPEED * state.velocity * step
    }

    if (now - prevThrottled > 60) {
      // Create new palms row
      if (
        palms.length &&
        palms[palms.length - 1][0].position.z - PALM_START >= PALM_STEP
      ) {
        createPalmsPair()
      }

      // Remove invisible palms row
      if (palms[0] && palms[0][0].position.z >= 0) {
        const [p1, p2] = palms.splice(0, 1)[0]
        scene.remove(p1)
        scene.remove(p2)
        p1.remove()
        p2.remove()
      }

      prevThrottled = now
    }

    prev = now
    // renderer.render(scene, camera)
    renderer.clear()
    composer.render()
    // renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(now => {
    prev = now
    prevThrottled = now
    initPalms()
    render(now)
  })
}

main()
