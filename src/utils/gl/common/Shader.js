
export default class Shader {
  constructor (gl, shaderType) {
    this.gl = gl
    this.shaderType = shaderType
  }

  compile (shaderSource) {
    this.id = this.gl.createShader(this.shaderType)
    this.gl.shaderSource(this.id, shaderSource)
    this.gl.compileShader(this.id)
    var log = this.gl.getShaderInfoLog(this.id)
    if (log !== null && log !== '') {
      console.log(log)
      alert(log)
    }
    return this
  }

  getId () {
    return this.id
  }
}
