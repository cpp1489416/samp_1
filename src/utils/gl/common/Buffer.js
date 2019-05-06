export default class Buffer {
  constructor (gl, type, usagePattern) {
    this.gl = gl
    this.created = false
    this.type = type
    this.usagePattern = usagePattern
  }

  create () {
    if (!this.created) {
      this.created = true
      this.buffer = this.gl.createBuffer()
    }
  }

  setData (data) {
    this.bind()
    this.gl.bufferData(this.type, data, this.usagePattern)
  }

  bind () {
    if (!this.created) {
      this.create()
    }
    this.gl.bindBuffer(this.type, this.buffer)
  }

  unbind () {
    this.gl.bindBuffer(this.type, null)
  }
}
