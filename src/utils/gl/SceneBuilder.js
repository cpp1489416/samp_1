import Scene from './Scene'
import BasicCamera from './cameras/BasicCamera'
import ObjMesh from './things/ObjMesh'
import Transform from './common/Transform'
import ObjMeshMirror from './things/ObjMeshMirror'
import Anchor from './things/Anchor'
import PlaneReflectedCamera from './cameras/PlaneReflectedCamera'
import { quat, vec3 } from 'gl-matrix'

export default class SceneBuilder {
  setGl (gl) {
    this.gl = gl
    return this
  }

  setConfig (config) {
    this.config = config
    return this
  }

  setSize (width, height) {
    this.size = {
      width: width,
      height: height
    }
    return this
  }

  getCamera () {
    return this.camera
  }

  getModel (name) {
    if (!this.modelsMap.has(name)) {
      console.error('no such model: ' + name)
    }
    return this.modelsMap.get(name)
  }

  getScene () {
    return this.scene
  }

  build () {
    this.models = new Map()
    for (var name in this.config) {
      if (!this.config.hasOwnProperty(name)) {
        continue
      }
      switch (name) {
        case 'camera':
          this.camera = this.buildCamera(this.config['camera'])
          break
        case 'models':
          this.modelsMap = this.buildModels(this.config['models'])
          break
        case 'environment':
          this.environment = this.buildEnvironment(this.config['environment'])
          break
        default:
          alert('not such config: ' + name)
      }
    }

    this.scene = this.buildScene()
    return this
  }

  buildCamera (config) {
    if (config.projectionType !== 'perspective') {
      alert('not support camera version: ' + config.type)
    }
    const camera = new BasicCamera()
    camera.lookAt(config.position, config.target, config.up)
    camera.perspective(config.fovy, config.near, config.far)
    camera.setAspect(this.size.width / this.size.height)
    if (config.moveType === 'land_object') {
      camera.transformType = BasicCamera.TransformType.LandObject
    } else {
      camera.transformType = BasicCamera.TransformType.Aircraft
    }
    return camera
  }

  buildModels (config) {
    var modelsMap = new Map()
    config.forEach(modelConfig => {
      let model
      switch (modelConfig.type) {
        case 'obj_mesh':
          model = new ObjMesh(this.gl, modelConfig.url)
          break
        case 'obj_mesh_mirror':
          model = new ObjMeshMirror(this.gl, modelConfig.url)
          break
        case 'anchor':
          model = new Anchor(this.gl)
          break
        default:
          alert('no such model type: ' + modelConfig.type)
          return
      }
      model.configedName = modelConfig.name
      this.setConfigTransform(modelConfig.transform, model.transform)
      if (modelsMap.has(modelConfig.name)) {
        modelConfig.name += '_different '
      }
      if (modelConfig.visible === false) {
        model.setVisible(false)
      }
      modelsMap.set(modelConfig.name, model)
    })
    return modelsMap
  }

  setConfigTransform (config, transform) {
    if (typeof config === 'undefined') {
      return transform
    }
    if (typeof config.position !== 'undefined') {
      transform.setPosition(config.position)
    }
    if (typeof config.rotation !== 'undefined' && config.rotation.length === 3) {
      transform.setRotation(quat.fromEuler(quat.create(), config.rotation[0], config.rotation[1], config.rotation[2]))
    }
    if (typeof config.scaling !== 'undefined') {
      transform.setScaling(config.scaling)
    }
    return transform
  }

  buildEnvironment (config) {
    if (typeof config.mirrorEnabled === 'undefined') {
      this.config.mirrorEnabled = false
    }

    if (typeof config.directionLight === 'undefined') {
      config.directionLight = null
    } else {
      if (typeof config.directionLight.color === 'undefined') {
        config.directionLight.color = vec3.fromValues(1, 1, 1)
      }
      if (typeof config.directionLight.intensity === 'undefined') {
        config.directionLight.intensity = 1.0
      }
    }

    if (typeof config.ambientLightIntensity === 'undefined') {
      config.ambientLightIntensity = 1.0
    }
    return config
  }

  buildScene () {
    var scene = new Scene(this.gl)
      .setSize(this.size.width, this.size.height)
      .setDirectionLight(this.environment.directionLight)
      .setMirrorEnabled(this.environment.mirrorEnabled)
      .setAmbientLightIntensity(this.environment.ambientLightIntensity)

    for (var [name, model] of this.modelsMap.entries()) {
      model.name = name
      scene.addComponent(model)
    }
    scene.addComponent(this.camera)

    return scene
  }
}
