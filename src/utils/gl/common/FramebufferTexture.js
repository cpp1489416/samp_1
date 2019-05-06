import Texture from './Texture'

export default class FramebufferTexture {
  constructor (gl) {
    this.gl = gl
    this.created = false
  }

  setSize (width, height) {
    this.width = width
    this.height = height
    return this
  }

  create () {
    if (!this.created) {
      this.created = true
      this.framebufferId = this.gl.createFramebuffer()
    }
    return this
  }

  bindFramebuffer () {
    if (!this.created) {
      this.create()
    }
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId)
    return this
  }

  bindDefaultFramebuffer () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    return this
  }

  bindTexture () {
    this.texture.bind()
    return this
  }

  unbindFramebuffer () {
    this.bindDefaultFramebuffer()
    return this
  }

  getFramebufferId () {
    return this.framebufferId
  }

  getTexture () {
    return this.texture
  }

  build () {
    this.setSize(this.width, this.height)
    this.bindFramebuffer()
    this.texture = new Texture(this.gl).setSize(this.width, this.height).build()
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_R, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      this.texture.getId(),
      0)

    this.depthRenderBufferId = this.gl.createRenderbuffer()
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthRenderBufferId)
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height)
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthRenderBufferId)

    var e = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER)
    if (e !== this.gl.FRAMEBUFFER_COMPLETE) {
      alert('cannot create framebuffer:' + e.toString())
    }

    this.unbindFramebuffer() // framebuffer must unbind after use
    return this
  }
}
