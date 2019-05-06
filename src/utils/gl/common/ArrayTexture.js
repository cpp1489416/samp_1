
export default class {
  constructor (gl) {
    this.gl = gl
    this.created = false
    this.bound = 0
  }

  create () {
    if (!this.created) {
      this.created = true
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
      this.id = this.gl.createTexture()
    }
  }

  destroy () {
    if (this.created) {
      this.created = false
    }
  }

  bind () {
    if (!this.created) {
      this.create()
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.id)
  }

  getId () {
    return this.id
  }

  setWrap (setting) {
    this.bind()
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_R, setting)
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_S, setting)
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_T, setting)
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
    this.gl.texImage3D(this.gl.TEXTURE_2D_ARRAY, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([255, 122, 255, 255]))

    image.onload = function () {
      that.bind()
      that.gl.pixelStorei(that.gl.UNPACK_FLIP_Y_WEBGL, true)
      that.gl.texImage3D(
        that.gl.TEXTURE_2D_ARRAY,
        0, // level
        that.gl.RGBA, // internal format
        image.width,
        image.height,
        1, // depth
        0, // border
        that.gl.RGBA, // format
        that.gl.UNSIGNED_BYTE,
        null)

      that.gl.texSubImage(
        that.gl.TEXTURE_2D_ARRAY,
        0, // level
        0, // x offset
        0, // y offset
        0, // z offset
        image.width,
        image.height,
        1, // depth
        that.gl.RGBA,
        that.gl.UNSIGNED_BYTE,
        image)

      that.gl.texParameterf(that.gl.TEXTURE_2D_ARRAY, that.gl.TEXTURE_MIN_FILTER, that.gl.LINEAR)
      that.gl.texParameterf(that.gl.TEXTURE_2D_ARRAY, that.gl.TEXTURE_MAG_FILTER, that.gl.LINEAR)
    }
    image.src = url

    return this
  }
}
