/* eslint-disable indent,no-multi-spaces */

import { mat4, vec3, vec4 } from 'gl-matrix'
import Camera from '../common/Camera'
import BasicCamera from './BasicCamera'
import MatrixMath from '../tools/MatrixMath'

export default class PlaneReflectedCamera extends Camera {
  constructor (parentCamera, plane) {
    super()
    this.parentCamera = parentCamera
    this.parentCamera.addEventListener(this)
    if (typeof (plane) === 'undefined') {
      plane = null
    }
    this.changePlane(plane)
  }

  changePlane (plane) {
    this.plane = plane
    this.onViewMatrixChanged()
    return this
  }

  getPlane (plane) {
    return this.plane
  }

  onViewMatrixChanged () {
    if (this.plane === null) {
      this.xVector = this.parentCamera.xVector
      this.yVector = this.parentCamera.yVector
      this.zVector = this.parentCamera.zVector
      this.position = this.parentCamera.position
      this.viewMatrix = this.parentCamera.viewMatrix
    } else {
      this.xVector = MatrixMath.reflectVector(vec3.create(), this.parentCamera.xVector, this.plane)
      this.yVector = MatrixMath.reflectVector(vec3.create(), this.parentCamera.yVector, this.plane)
      this.zVector = MatrixMath.reflectVector(vec3.create(), this.parentCamera.zVector, this.plane)
      var reflectMatrix = MatrixMath.reflectMatrix(mat4.create(), this.plane)
      this.position = vec3.transformMat4(vec3.create(), this.parentCamera.position, reflectMatrix)
      this.updateViewMatrix()
    }
    this.notifyViewMatrixChanged()
  }

  onProjectionMatrixChanged () {
    this.notifyProjectionMatrixChanged()
  }

  updateViewMatrix () {
    var x = -vec3.dot(this.xVector, this.position)
    var y = -vec3.dot(this.yVector, this.position)
    var z = -vec3.dot(this.zVector, this.position)

    var view = mat4.create()

    mat4.set(
      view,
      this.xVector[0], this.yVector[0], this.zVector[0], 0,
      this.xVector[1], this.yVector[1], this.zVector[1], 0,
      this.xVector[2], this.yVector[2], this.zVector[2], 0,
      x, y, z, 1
    )

    this.viewMatrix = view
    this.correctPlaneNormalDirection()
  }

  correctPlaneNormalDirection () {
    if (vec4.dot(vec4.fromValues(this.position[0], this.position[1], this.position[2], 1), this.plane) > 0) {
      MatrixMath.changePlaneNormalDirection(this.plane, this.plane)
    }
  }

  getSkyboxViewMatrix () {
    var view = mat4.clone(this.getViewMatrix())
    view[12] = view[13] = view[14] = 0
    return view
  }

  getViewMatrix () {
    return this.viewMatrix
  }

  getProjectionMatrix () {
    return this.parentCamera.getProjectionMatrix()
  }

  getPosition () {
    return this.position
  }
}
