import * as THREE from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge'
import { publicUrl } from './helpers'

export const loadMaterial = (arg: { url: string }) =>
  new Promise<MTLLoader.MaterialCreator>((resolve, reject) => {
    const mtlLoader = new MTLLoader()
    mtlLoader.setMaterialOptions({
      // invertTrProperty: false,
      // normalizeRGB: true,
      ignoreZeroRGBs: true,
      wrap: THREE.MirroredRepeatWrapping,
      side: THREE.DoubleSide,
    })
    mtlLoader.load(publicUrl + arg.url, mtl => {
      resolve(mtl)
    })
  })

export const loadObject = (arg: {
  url: string
  mtl: MTLLoader.MaterialCreator
}) =>
  new Promise<THREE.Object3D>(async (resolve, reject) => {
    const objLoader = new OBJLoader2()
    if (arg.mtl) {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(arg.mtl)
      objLoader.addMaterials(materials, false)
    }
    objLoader.load(
      publicUrl + arg.url,
      obj => {
        obj.castShadow = true
        obj.receiveShadow = true
        resolve(obj)
      },
      xhr => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
      error => reject(error),
    )
  })

export const loadModel = async (arg: { obj: string; mtl?: string }) => {
  const mtl = arg.mtl && (await loadMaterial({ url: arg.mtl }))
  const model = await loadObject({ url: arg.obj, mtl })
  return model
}
