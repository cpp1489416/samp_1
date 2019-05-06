/* eslint-disable no-irregular-whitespace */
import { vec3, vec4, mat4, quat } from 'gl-matrix'

export default class MatrixMath {
  static reflectMatrix (m, plane) {
    m[0] = 1 - 2 * plane[0] * plane[0]
    m[4] = -2 * plane[1] * plane[0]
    m[8] = -2 * plane[2] * plane[0]
    m[12] = -2 * plane[3] * plane[0]

    m[1] = -2 * plane[0] * plane[1]
    m[5] = 1 - 2 * plane[1] * plane[1]
    m[9] = -2 * plane[2] * plane[1]
    m[13] = -2 * plane[3] * plane[1]

    m[2] = -2 * plane[0] * plane[2]
    m[6] = -2 * plane[1] * plane[2]
    m[10] = 1 - 2 * plane[2] * plane[2]
    m[14] = -2 * plane[3] * plane[2]

    m[3] = 0
    m[7] = 0
    m[11] = 0
    m[15] = 1

    return m
  }

  static reflectVector (out, vec, plane) {
    var i = vec3.normalize(vec3.create(), vec)
    var n = vec3.normalize(vec3.create(), plane)
    var s2 = vec3.scale(vec3.create(), n, -2 * vec3.dot(i, n))
    vec3.add(out, i, s2)

    return out
  }

  static normalizePlane (out, plane) {
    var len = 1.0 / Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2])
    out[0] = plane[0] * len
    out[1] = plane[1] * len
    out[2] = plane[2] * len
    out[3] = plane[3] * len
    return out
  }

  static pointPlaneToVectorPlane (out, vec1, vec2, vec3) {
    //
    // (y2*z3 - y2*z1 - y1*z3 - y3*z2 + y1*z2 + y3*z1)*X +
    // (x3*z2 - x1*z2 - x3*z1 - x2*z3 + x2*z1 + x1*z3)*Y +
    //  (x2*y3 - x2*y1 - x1*y3 - x3*y2 + x3*y1 + x1*y2)*Z +
    // x1*y3*z2 + x2*y1*z3 + x3*y2*z1 - x1*y2*z3 - x3*y1*z2 - x2*y3*z1 = 0;

    var x1 = vec1[0]
    var y1 = vec1[1]
    var z1 = vec1[2]
    var x2 = vec2[0]
    var y2 = vec2[1]
    var z2 = vec2[2]
    var x3 = vec3[0]
    var y3 = vec3[1]
    var z3 = vec3[2]
    out[0] = y2 * z3 - y2 * z1 - y1 * z3 - y3 * z2 + y1 * z2 + y3 * z1
    out[1] = x3 * z2 - x1 * z2 - x3 * z1 - x2 * z3 + x2 * z1 + x1 * z3
    out[2] = x2 * y3 - x2 * y1 - x1 * y3 - x3 * y2 + x3 * y1 + x1 * y2
    out[3] = x1 * y3 * z2 + x2 * y1 * z3 + x3 * y2 * z1 - x1 * y2 * z3 - x3 * y1 * z2 - x2 * y3 * z1
    return MatrixMath.normalizePlane(out, out)
  }

  static transformPlane (out, plane, m) {
    var m1 = mat4.invert(mat4.create, m)
    m1 = mat4.transpose(m1, m1)
    vec4.transformMat4(out, plane, m1)
    return out
  }

  static changePlaneNormalDirection (out, plane) {
    out[0] = -plane[0]
    out[1] = -plane[1]
    out[2] = -plane[2]
    out[3] = -plane[3]
  }

  static quadToEuler (out, q) {
    var x = q[0]
    var y = q[1]
    var z = q[2]
    var w = q[3]
    out[0] = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)) / Math.PI * 180
    out[1] = Math.asin(2 * (w * y - z * x)) / Math.PI * 180
    out[3] = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) / Math.PI * 180

    // roll (x-axis rotation)
    var sinr_cosp = +2.0 * (q[3] * q[0] + q[1] * q[2])
    var cosr_cosp = +1.0 - 2.0 * (q[0] * q[0] + q[1] * q[1])
    out[0] = Math.atan2(sinr_cosp, cosr_cosp)

    // pitch (y-axis rotation)
    var sinp = +2.0 * (q[3] * q[1] - q[2] * q[0])
    if (Math.abs(sinp) >= 1) {
      // out[1] = copysign(M_PI / 2, sinp)
    } else {
      out[1] = Math.asin(sinp)
      // use 90 degrees if out of range
    }

    // yaw (z-axis rotation)
    var siny_cosp = +2.0 * (q[3] * q[2] + q[0] * q[1])
    var cosy_cosp = +1.0 - 2.0 * (q[1] * q[1] + q[2] * q[2])
    out[2] = Math.atan2(siny_cosp, cosy_cosp)

    out[0] *= 180.0 / Math.PI
  }

  static getRotationMatrix (out, m) {
    var v0 = [m[0], m[1], m[2]]
    var v1 = [m[4], m[5], m[6]]
    var v2 = [m[8], m[9], m[10]]
    vec3.normalize(v0, v0)
    vec3.normalize(v1, v1)
    vec3.normalize(v2, v2)
    mat4.set(
      out,
      v0[0], v1[0], v2[0], 0,
      v0[1], v1[1], v2[1], 0,
      v0[2], v1[2], v2[2], 0,
      0, 0, 0, 1
    )
    return out
  }

  static getRotationEuler (out, m) {
    var v0 = [m[0], m[1], m[2]]
    var v1 = [m[4], m[5], m[6]]
    var v2 = [m[8], m[9], m[10]]
    vec3.normalize(v0, v0)
    vec3.normalize(v1, v1)
    vec3.normalize(v2, v2)
    var r11 = v0[0]
    var r21 = v0[1]
    var r31 = v0[2]
    var r12 = v1[0]
    var r22 = v1[1]
    var r32 = v1[2]
    var r13 = v2[0]
    var r23 = v2[1]
    var r33 = v2[2]
    out[0] = Math.atan2(r32, r33) * 180.0 / Math.PI
    out[1] = Math.atan2(-r31, Math.sqrt(r32 * r32, r33 * r33)) * 180.0 / Math.PI
    out[2] = Math.atan2(r21, r11) * 180.0 / Math.PI
    return out
  }

  static getRotationMatrixFromEuler (out, euler) {
    var x = mat4.fromXRotation(mat4.create(), euler[0] / 180.0 * Math.PI)
    var y = mat4.fromYRotation(mat4.create(), euler[1] / 180.0 * Math.PI)
    var z = mat4.fromZRotation(mat4.create(), euler[2] / 180.0 * Math.PI)
    mat4.identity(out)
    mat4.mul(out, out, x)
    mat4.mul(out, out, y)
    mat4.mul(out, out, z)
    return out
  }
}
