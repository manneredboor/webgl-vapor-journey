import { loadModel } from './loaders'

// Plant
const loadPlant = async () => {
  const model = await loadModel({
    obj: '/cartoon_plant/cartoon_plant.obj',
    mtl: '/cartoon_plant/cartoon_plant.mtl',
  })
  model.scale.set(0.02, 0.02, 0.02)
  return model
}

// Palm
const loadPalm = async () => {
  const model = await loadModel({
    obj: '/palmsimple/MY_PALM.obj',
    mtl: '/palmsimple/MY_PALM.mtl',
    // obj: '/palmtreeOBJ/palmtree.obj',
    // mtl: '/palmtreeOBJ/palmtree.mtl',
  })
  model.scale.set(0.069, 0.069, 0.069)
  return model
}

// Elephant
const loadElephant = async () => {
  const model = await loadModel({
    obj: '/elephant.obj',
  })
  model.scale.set(2, 2, 2)
  return model
}

// Alien
const loadAlien = async () => {
  const model = await loadModel({
    obj: '/Alien.obj',
  })
  model.scale.set(1.2, 1.2, 1.2)
  return model
}

// All
export const loadModels = async () => {
  const [plant, palm, elephant, alien] = await Promise.all([
    loadPlant(),
    loadPalm(),
    loadElephant(),
    loadAlien(),
  ])
  return {
    plant,
    palm,
    elephant,
    alien,
  }
}
