import Camera from './common/Camera'
import SkyboxTechnique from './techniques/SkyboxTechnique'
import MainTechnique from './techniques/MainTechnique'
import JustColorSubTechnique from './techniques/JustColorSubTechnique'
import ObjMesh from './things/ObjMesh'
import Anchor from './things/Anchor'
import { vec3, mat4, quat } from 'gl-matrix'
import Quad from './things/Quad'
import BasicCamera from './cameras/BasicCamera'
import FramebufferTexture from './common/FramebufferTexture'
import RttTechnique from './techniques/RttTechnique'
import PlaneReflectedCamera from './cameras/PlaneReflectedCamera'
import ObjMeshMirror from './things/ObjMeshMirror'

export default class {
  constructor (gl) {
    this.gl = gl
    this.skyboxTechnique = new SkyboxTechnique(gl)
    this.mainTechnique = new MainTechnique(gl)
    this.basicTechnique = new JustColorSubTechnique(gl)
    this.supportTechnique = new JustColorSubTechnique(gl)
    this.rttTechnique = new RttTechnique(gl)
    this.mirrorEnabled = false
    this.mirrorInited = false
    this.initGl()
  }

  addComponent (component) {
    if (component instanceof Camera) {
      this.camera = component
      this.skyboxTechnique.addComponent(component)
      this.mainTechnique.addComponent(component)
      this.rttTechnique.addComponent(component)
      this.basicTechnique.addComponent(component)
      this.mirrorInited = false
      this.setMirrorEnabled(this.mirrorEnabled)
    } else if (component instanceof ObjMesh) {
      this.mainTechnique.addComponent(component)
    } else if (component instanceof ObjMeshMirror) {
      this.mirrorInited = false
      this.rttTechnique.addThing(component)
    } else {
      this.basicTechnique.addComponent(component)
    }
    return this
  }

  initMirror () {
    for (var i in this.rttTechnique.getThings()) {
      var thing = this.rttTechnique.getThings()[i]
      thing.setCamera(this.camera)
      thing.rtt = new FramebufferTexture(this.gl).setSize(this.width, this.height).build()
      thing.setTexture(thing.rtt.getTexture())
    }

    this.mirrorInited = true
  }

  setSize (width, height) {
    this.width = width
    this.height = height
    this.setMirrorEnabled(this.mirrorEnabled)
    return this
  }

  setMirrorEnabled (enabled) {
    this.mirrorEnabled = enabled
    return this
  }

  setAmbientLightIntensity (intensity) {
    this.mainTechnique.setAmbientLightIntensity(intensity)
    return this
  }

  setDirectionLight (light) {
    this.mainTechnique.setDirectionLight(light)
    return this
  }

  drawInFramebuffer () {
    this.gl.viewport(0, 0, this.width, this.height)
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
    this.skyboxTechnique.drawThings()
    this.mainTechnique.drawThings()
    this.basicTechnique.drawThings()
  }

  drawSupports () {
    this.gl.viewport(0, 0, 60, 60)
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
    this.supportTechnique.drawThings()
  }

  draw () {
    if (this.camera == null) {
      return
    }

    this.anchor.transform.matrix = mat4.create()
    mat4.mul(this.anchor.transform.matrix, this.anchor.transform.matrix, this.camera.getSkyboxViewMatrix())
    mat4.translate(this.anchor.transform.matrix, this.anchor.transform.matrix, [-0.5, -0.5, -0.5])
    mat4.scale(this.anchor.transform.matrix, this.anchor.transform.matrix, [4, 4, 4])

    if (this.mirrorEnabled) {
      if (!this.mirrorInited) {
        this.initMirror()
      }
      for (var i in this.rttTechnique.getThings()) {
        var thing = this.rttTechnique.getThings()[i]
        if (!thing.fileLoaded) {
          continue
        }
        // console.log(thing)
        // console.log(thing)
        thing.rtt.bindFramebuffer()
        this.skyboxTechnique.setCamera(thing.getMirrorCamera())
        this.mainTechnique.setCamera(thing.getMirrorCamera())
        // alert(typeof thing.getMirrorCamera())
        this.mainTechnique.setClipPlane0(thing.getMirrorCamera().getPlane())
        this.drawInFramebuffer()
        thing.rtt.unbindFramebuffer()
        // break
      }

      this.skyboxTechnique.setCamera(this.camera)
      this.mainTechnique.setCamera(this.camera)
      this.mainTechnique.setClipPlane0(null)
      this.drawInFramebuffer()
      this.rttTechnique.drawThings()
      this.drawSupports()
    } else {
      this.drawInFramebuffer()
      this.drawSupports()
    }
  }

  initGl () {
    // enviroment
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LESS)

    this.anchor = new Anchor(this.gl)
    this.supportTechnique.camera = new BasicCamera()
    this.supportTechnique.camera.ortho(-5, 5, -5, 5, 0.001, 100)
    this.supportTechnique.camera.lookAway([0, 0, -4])
    this.supportTechnique.addComponent(this.anchor)
  }
}
