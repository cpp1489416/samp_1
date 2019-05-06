
import Texture from './Texture'

export default class {
  constructor (gl) {
    this.gl = gl
  }

  setWrap (setting) {
    for (var i in this.textures) {
      this.textures[i].bind()
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_R, setting)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, setting)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, setting)
    }
    return this
  }

  updateToUniform () {
    /*
    Never mind, I think I found the solution. My code looks as follows:

var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(...
gl.bindTexture(gl.TEXTURE_2D, null);
textures[i] = texture;

...compose texture images...

gl.activeTexture(gl.TEXTURE0 + i);
gl.bindTexture(gl.TEXTURE_2D, textures[i]);
gl.texSubImage2D(gl.TEXTURE_2D, 0, xoffset, yoffset, gl.RGBA, gl.UNSIGNED_BYTE, image);

...fill all textures...

var sampler = gl.getUniformLocation(program, "u_sampler");
var samplerArray = new Int32Array(textures.length);
var len = samplerArray.length;
while (len--) {
    samplerArray[len] = len;
}
gl.uniform1iv(sampler, samplerArray);
     */
  }

  getSamplerArray () {
    var samplerArray = new Int32Array(this.textures.length)
    var len = this.textures.length
    while (len--) {
      samplerArray[len] = len
    }
    return samplerArray
  }

  bind () {
    for (var i = 0; i < this.textures.length; i++) {
      this.gl.activeTexture(this.gl.TEXTURE0 + i)
      this.textures[i].bind()
    }
  }

  fromImages (urls) {
    this.textures = []
    for (var i = 0; i < urls.length; ++i) {
      this.textures.push(new Texture(this.gl).setBound(i).fromImage(urls[i]))
    }
    return this
  }
}
