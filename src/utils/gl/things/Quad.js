import Thing from '../common/Thing.js'
import Buffer from '../common/Buffer'
import VertexArrayObject from '../common/VertexArrayObject'
import Texture from '../common/Texture'

export default class extends Thing {
  onCreateVbo () {
    this.vboPositions = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
    this.vboTextureCoords = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)

    const positions = new Float32Array([
      -1, -1, 0,
      1, -1, 0,
      1, 1, 0,

      1, 1, 0,
      -1, 1, 0,
      -1, -1, 0
    ])

    const textureCoords = new Float32Array([
      0, 0,
      1, 0,
      1, 1,

      1, 1,
      0, 1,
      0, 0
    ])

    this.vboPositions.setData(positions)
    this.vboTextureCoords.setData(textureCoords)
  }

  async onCreateVao (technique, requirement) {
    this.vao = new VertexArrayObject(this.gl)
    this.vao.bind()

    var positionAttributeId = technique.getPositionAttribute()
    this.vboPositions.bind()
    this.gl.enableVertexAttribArray(positionAttributeId)
    this.gl.vertexAttribPointer(positionAttributeId, 3, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)

    if (requirement.needTexture) {
      var textureCoordId = technique.getTextureCoordAttribute()
      this.vboTextureCoords.bind()
      this.gl.enableVertexAttribArray(textureCoordId)
      this.gl.vertexAttribPointer(textureCoordId, 2, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)
    }
  }

  onDraw () {
    this.vao.bind()
    if (typeof this.texture !== 'undefined') {
      this.texture.bind()
    }
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }

  setCamera () {}

  setTexture (texture) {
    this.texture = texture
  }
}
