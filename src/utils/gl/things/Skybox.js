import Thing from '../common/Thing.js'
import Buffer from '../common/Buffer'
import VertexArrayObject from '../common/VertexArrayObject'
import Texture from '../common/Texture'
import cube_map_px_dir from '@/assets/textures/CubeMapPX.png'
import cube_map_nx_dir from '@/assets/textures/CubeMapNX.png'
import cube_map_py_dir from '@/assets/textures/CubeMapPY.png'
import cube_map_ny_dir from '@/assets/textures/CubeMapNY.png'
import cube_map_pz_dir from '@/assets/textures/CubeMapPZ.png'
import cube_map_nz_dir from '@/assets/textures/CubeMapNZ.png'

export default class extends Thing {
  onCreateVbo () {
  }

  onCreateVao (technique, requirement) {
    var texturesDir = [cube_map_px_dir, cube_map_nx_dir, cube_map_py_dir, cube_map_ny_dir, cube_map_pz_dir, cube_map_nz_dir]
    this.textures = []
    for (var i = 0; i < 6; i++) {
      this.textures.push(new Texture(this.gl).fromImage(texturesDir[i]).setWrap(this.gl.CLAMP_TO_EDGE))
    }
    var vertices = [
      new Float32Array([//  left face, +X, CCW
        1, -1, -1, 0, 0, // left down
        1, -1, 1, 1, 0, // right down
        1, 1, 1, 1, 1, // right up
        1, 1, -1, 0, 1 // left up
      ]),
      new Float32Array([// right face, -X, CCW
        -1, -1, 1, 0, 0,
        -1, -1, -1, 1, 0,
        -1, 1, -1, 1, 1,
        -1, 1, 1, 0, 1
      ]),
      new Float32Array([ // up face, +Y, CCW
        1, 1, 1, 0, 0,
        -1, 1, 1, 1, 0,
        -1, 1, -1, 1, 1,
        1, 1, -1, 0, 1
      ]),
      new Float32Array([// down face, -Y, CCW
        1, -1, -1, 0, 0,
        -1, -1, -1, 1, 0,
        -1, -1, 1, 1, 1,
        1, -1, 1, 0, 1
      ]),
      new Float32Array([// back face, +Z, CCW
        1, -1, 1, 0, 0,
        -1, -1, 1, 1, 0,
        -1, 1, 1, 1, 1,
        1, 1, 1, 0, 1
      ]),
      new Float32Array([ // back face, -Z, CCW
        -1, -1, -1, 0, 0,
        1, -1, -1, 1, 0,
        1, 1, -1, 1, 1,
        -1, 1, -1, 0, 1
      ])
    ]

    var indices = new Uint16Array([
      0, 1, 2,
      2, 3, 0
    ])

    var colors = new Float32Array([
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0
    ])

    this.vboPositions = []
    this.vboTextureCoords = []
    this.vaos = []
    this.ebo = new Buffer(this.gl, this.gl.ELEMENT_ARRAY_BUFFER, this.gl.STATIC_DRAW)
    for (let i = 0; i < 6; ++i) {
      this.vboPositions[i] = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
      this.vboColors = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
      this.vboTextureCoords[i] = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)

      this.vaos[i] = new VertexArrayObject(this.gl).bind()
      this.vboPositions[i].bind()
      this.vboPositions[i].setData(vertices[i])
      this.gl.enableVertexAttribArray(technique.getPositionAttribute())
      this.gl.vertexAttribPointer(technique.getPositionAttribute(), 3, this.gl.FLOAT, this.gl.FALSE, 5 * 4, this.gl.NULL)

      // return;
      if (requirement.needTexture) {
        this.vboTextureCoords[i].bind()
        this.vboTextureCoords[i].setData(vertices[i])
        this.gl.enableVertexAttribArray(technique.getTextureCoordAttribute())
        this.gl.vertexAttribPointer(technique.getTextureCoordAttribute(), 2, this.gl.FLOAT, this.gl.FALSE, 5 * 4, 3 * 4)
      }

      if (requirement.needColor) {
        var colorAttributeId = technique.getColorAttribute()
        this.vboColors.bind()
        this.vboColors.setData(colors)
        this.gl.enableVertexAttribArray(colorAttributeId)
        this.gl.vertexAttribPointer(colorAttributeId, 3, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)
      }

      this.ebo.bind()
      this.ebo.setData(indices)
    }
  }

  onDraw () {
    for (let i = 0; i < 6; i++) {
      this.vaos[i].bind()
      this.textures[i].bind()
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, this.gl.NULL)
    }
  }
}
