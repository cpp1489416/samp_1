
import Thing from '../common/Thing.js'
import Buffer from '../common/Buffer'
import VertexArrayObject from '../common/VertexArrayObject'
import ObjectMeshScanner from '../tools/ObjMeshScanner'
import axios from 'axios'
import TextureArray from '../common/TextureArray'
import Texture from '../common/Texture'
import MatrixMath from '../tools/MatrixMath'
import { vec4, vec3 } from 'gl-matrix'
import PlaneReflectedCamera from '../cameras/PlaneReflectedCamera'

export default class ObjMeshMirror extends Thing {
  constructor (gl, url) {
    super(gl)
    this.url = url
    this.fileLoaded = false
    this.texture = null
    this.originPlane = null
    this.camera = null
    this.reflectedCamera = null
  }

  setCamera (camera) {
    this.camera = camera
    this.reflectedCamera = new PlaneReflectedCamera(camera)
    this.updatePlane()
    return this
  }

  getMirrorCamera () {
    return this.reflectedCamera
  }

  setTexture (texture) {
    this.texture = texture
    return this
  }

  updatePlane () {
    if (this.fileLoaded === false || this.camera === null) {
      // alert('not updated')
      return this
    }
    var v1 = vec3.transformMat4(vec3.create(), this.point1, this.transform.getMatrix())
    var v2 = vec3.transformMat4(vec3.create(), this.point2, this.transform.getMatrix())
    var v3 = vec3.transformMat4(vec3.create(), this.point3, this.transform.getMatrix())
    this.plane = MatrixMath.pointPlaneToVectorPlane(vec4.create(), v1, v2, v3)
    // MatrixMath.transformPlane(vec4.create(), this.originPlane, this.transform.clone().getMatrix())
    this.reflectedCamera.changePlane(this.plane)
    return this
  }

  onTransformChanged (transform) {
    this.updatePlane()
  }

  onCreateVbo () {
  }

  async onCreateVao (technique, requirement) {
    this.requirement = requirement
    this.scanner = new ObjectMeshScanner(this.url)
    this.technique = technique
    await this.createVaoAndVbo(technique, requirement)
    this.fileLoaded = true
    this.updatePlane()
  }

  async createVaoAndVbo (technique, requirement) {
    this.technique = technique
    var scanner = this.scanner
    this.components = await scanner.getComponents()
    this.count = await scanner.getCount()

    this.vao = new VertexArrayObject(this.gl)
    this.vao.bind()

    this.vboPositions = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
    this.vboPositions.bind()
    var positions = await scanner.getPositions()
    this.vboPositions.setData(positions)
    var positionAttributeId = technique.getPositionAttribute()
    this.vboPositions.bind()
    this.gl.enableVertexAttribArray(positionAttributeId)
    this.gl.vertexAttribPointer(positionAttributeId, 3, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)

    // generate plane
    var v1 = [positions[0], positions[1], positions[2]]
    var v2 = [positions[3], positions[4], positions[5]]
    var v3 = [positions[6], positions[7], positions[8]]
    this.point1 = v1
    this.point2 = v2
    this.point3 = v3
    // alert(v1)
    // alert(v2)
    // alert(v3)
    this.originPlane = MatrixMath.pointPlaneToVectorPlane(vec4.create(), v1, v2, v3)
    // alert('generated plane: ' + this.originPlane)
    // this.originPlane = vec4.fromValues(0, 0, -1, 0)
  }

  onDraw () {
    if (!this.fileLoaded || this.texture == null) {
      return
    }
    this.technique.setRttCamera(this.getMirrorCamera())
    this.vao.bind()
    this.texture.bind()
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.count)
  }
}
