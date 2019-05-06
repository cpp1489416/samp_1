
export default class {
  constructor (gl) {
    this.gl = gl
    this.created = false
  }

  create () {
    if (!this.created) {
      this.created = true
      this.vao = this.gl.createVertexArray()
    }
    return this
  }

  bind () {
    if (!this.created) {
      this.create()
    }
    this.gl.bindVertexArray(this.vao)
    return this
  }

  unbind () {
    this.gl.bindVertexArray(null)
    return this
  }

  destroy () {
    if (this.created) {
      this.created = false
      this.gl.deleteVertexArray(this.vao)
    }
  }
}
