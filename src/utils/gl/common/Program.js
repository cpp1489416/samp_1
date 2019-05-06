
export default class {
  constructor (gl) {
    this.gl = gl
    this.created = false
    this.linked = false
    this.id = null
  }

  getId () {
    return this.id
  }

  create () {
    if (!this.created) {
      this.created = true
      this.id = this.gl.createProgram()
    }
    return this
  }

  destroy () {
    if (this.created) {
      this.created = false
      this.linked = false
      this.gl.deleteProgram(this.id)
    }
    return this
  }

  link () {
    if (!this.linked) {
      this.linked = true
      this.gl.linkProgram(this.id)
      var log = this.gl.getProgramInfoLog(this.id)
      if (log !== null && log.trim() !== '') {
        alert(log)
      }
    }
    return this
  }

  bind () {
    if (!this.created) {
      this.create()
    }
    if (!this.linked) {
      this.link()
    }
    this.gl.useProgram(this.id)
    return this
  }

  unbind () {
    this.gl.useProgram(0)
    return this
  }

  addShader (shader) {
    if (!this.created) {
      this.create()
    }
    this.gl.attachShader(this.id, shader.id)
    return this
  }

  getAttributeId (name) {
    return this.gl.getAttribLocation(this.id, name)
  }

  getUniformId (name) {
    return this.gl.getUniformLocation(this.id, name)
  }

  setAttributeBuffer (id, size, type, stride) {
    this.gl.enableVertexAttribArray(id)
    this.gl.vertexAttribPointer(id, size, type, this.gl.FALSE, stride, this.gl.NULL)
  }

  setUniformValue (name, x, y, z) {
    var id = this.getAttributeId(name)
    this.gl.uniform3f(id, x, y, z)
  }
}
