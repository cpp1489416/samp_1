
export default class {
  constructor (gl) {
    this.gl = gl
    this.created = false
    this.bound = 0
  }

  create () {
    if (!this.created) {
      this.created = true
      this.gl.activeTexture(this.gl.TEXTURE0 + this.bound)
      this.id = this.gl.createTexture()
    }
    return this
  }

  destroy () {
    if (this.created) {
      this.created = false
    }
  }

  setSize (width, height) {
    this.width = width
    this.height = height
    return this
  }

  bind () {
    if (!this.created) {
      this.create()
    }

    this.gl.activeTexture(this.gl.TEXTURE0 + this.bound)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id)
    return this
  }

  getId () {
    return this.id
  }

  setWrap (setting) {
    this.bind()
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_R, setting)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, setting)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, setting)
    return this
  }

  setBound (bound) {
    this.bound = bound
    return this
  }

  fromImage (url) {
    this.bind()
    var image = new Image()
    var that = this
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
      new Uint8Array([
        255, 125, 255, 255,
        255, 1, 255, 255,
        255, 1, 255, 255,
        255, 1, 255, 255
      ]))

    image.onload = function () {
      that.bind()
      that.gl.pixelStorei(that.gl.UNPACK_FLIP_Y_WEBGL, true)
      that.gl.texImage2D(that.gl.TEXTURE_2D, 0, that.gl.RGB, that.gl.RGB, that.gl.UNSIGNED_BYTE, image)
      that.gl.texParameterf(that.gl.TEXTURE_2D, that.gl.TEXTURE_MIN_FILTER, that.gl.LINEAR)
      that.gl.texParameterf(that.gl.TEXTURE_2D, that.gl.TEXTURE_MAG_FILTER, that.gl.LINEAR)
    }
    image.src = url

    return this
  }

  build () {
    this.bind()
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null)
    this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    return this
  }
}
