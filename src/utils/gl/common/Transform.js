import { mat4, quat, vec3 } from 'gl-matrix'
import MatrixMath from '../tools/MatrixMath'

export default class Transform {
  constructor () {
    this.matrix = mat4.create()
    this.eventListeners = []
  }

  addEventListener (listener) {
    this.eventListeners.push(listener)
  }

  notifyEventListeners () {
    for (var i in this.eventListeners) {
      if (typeof this.eventListeners[i].onTransformChanged !== 'undefined') {
        this.eventListeners[i].onTransformChanged(this)
      }
    }
  }

  getPosition () {
    return mat4.getTranslation(vec3.create(), this.matrix)
  }

  getTranslationMatrix () {
    return mat4.fromTranslation(mat4.create(), this.getPosition())
  }

  getRotation () {
    var ans = mat4.getRotation(quat.create(), this.matrix)
    return ans
  }

  getRotationMatrix () {
    return mat4.fromQuat(mat4.create(), this.getRotation())
  }

  getScaling () {
    return mat4.getScaling(vec3.create(), this.matrix)
  }

  getScalingMatrix () {
    return mat4.fromScaling(mat4.create(), this.getScaling())
  }

  setPosition (position) {
    var t = mat4.fromTranslation(mat4.create(), position)
    var m = mat4.mul(mat4.create(), t, this.getRotationMatrix())
    m = mat4.mul(m, m, this.getScalingMatrix())
    this.matrix = m
    this.notifyEventListeners()
    return this
  }

  setRotation (rotation) {
    var r = mat4.fromQuat(mat4.create(), rotation)
    var m = mat4.mul(mat4.create(), this.getTranslationMatrix(), r)
    m = mat4.mul(m, m, this.getScalingMatrix())
    this.matrix = m
    this.notifyEventListeners()
    return this
  }

  setScaling (scaling) {
    var s = mat4.fromScaling(mat4.create(), scaling)
    var m = mat4.mul(mat4.create(), this.getTranslationMatrix(), this.getRotationMatrix())
    m = mat4.mul(m, m, s)
    this.matrix = m
    this.notifyEventListeners()
    return this
  }

  setMatrix (matrix) {
    this.matrix = matrix
    this.notifyEventListeners()
    return this
  }

  updateFromTransform (transform) {
    this.eventListeners = transform.eventListeners
    transform.eventListeners = null
    this.setMatrix(transform.getMatrix())
    return this
  }

  getMatrix () {
    return this.matrix
  }

  getNormalMatrix () {
    var m = mat4.invert(mat4.create(), this.matrix)
    mat4.transpose(m, m)
    return m
  }

  clone () {
    var a = new Transform()
    a.matrix = this.matrix
    return a
  }
}
