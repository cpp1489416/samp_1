
import Thing from '../common/Thing.js'
import Buffer from '../common/Buffer'
import VertexArrayObject from '../common/VertexArrayObject'
import ObjectMeshScanner from '../tools/ObjMeshScanner'
import axios from 'axios'
import TextureArray from '../common/TextureArray'
import Texture from '../common/Texture'

export default class ObjMesh extends Thing {
  constructor (gl, url) {
    super(gl)
    this.url = url
    this.fileLoaded = false
    this.AMBIENT_MAP_TEXTURE_BOUND = 0
    this.DIFFUSE_MAP_TEXTURE_BOUND = 1
  }

  onCreateVbo () {
  }

  async onCreateVao (technique, requirement) {
    this.requirement = requirement
    this.scanner = new ObjectMeshScanner(this.url)
    this.technique = technique
    await this.createVaoAndVbo(technique, requirement)
    this.fileLoaded = true
  }

  async createVaoAndVbo (technique, requirement) {
    var scanner = this.scanner
    this.components = await scanner.getComponents()
    this.count = await scanner.getCount()

    this.vao = new VertexArrayObject(this.gl)
    this.vao.bind()

    this.vboPositions = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
    this.vboPositions.bind()
    this.vboPositions.setData(await scanner.getPositions())
    var positionAttributeId = technique.getPositionAttribute()
    this.vboPositions.bind()
    this.gl.enableVertexAttribArray(positionAttributeId)
    this.gl.vertexAttribPointer(positionAttributeId, 3, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)

    /* obsolete, no need colors
    if (requirement.needColor) {
      this.vboColors = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
      this.vboColors.bind()
      this.vboColors.setData(await scanner.getColors())
      var colorAttributeId = technique.getColorAttribute()
      this.vboColors.bind()
      this.gl.enableVertexAttribArray(colorAttributeId)
      this.gl.vertexAttribPointer(colorAttributeId, 3, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)
    }
    */

    if (requirement.needNormal) {
      this.vboNormals = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
      this.vboNormals.bind()
      this.vboNormals.setData(await scanner.getNormals())
      var normalAttributeId = technique.getNormalAttribute()
      this.vboNormals.bind()
      this.gl.enableVertexAttribArray(normalAttributeId)
      this.gl.vertexAttribPointer(normalAttributeId, 3, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)
    }

    if (requirement.needTexture) {
      this.vboTextureCoords = new Buffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW)
      this.vboTextureCoords.bind()
      this.vboTextureCoords.setData(await scanner.getTextureCoords())
      var textureCoordId = technique.getTextureCoordAttribute()
      this.vboTextureCoords.bind()
      this.gl.enableVertexAttribArray(textureCoordId)
      this.gl.vertexAttribPointer(textureCoordId, 3, this.gl.FLOAT, this.gl.FALSE, 0, this.gl.NULL)

      var diffuseTexturesMap = new Map()
      var ambientTexturesMap = new Map()
      for (var i in this.components) {
        var component = this.components[i]
        var diffuseMapUrl = component.material.diffuseMapUrl
        var ambientMapUrl = component.material.ambientMapUrl

        if (typeof ambientMapUrl === 'undefined') {
          component.ambientMapTexture = null
        } else {
          var ambientMapTexture
          if (!ambientTexturesMap.has(ambientMapUrl)) {
            ambientMapTexture = new Texture(this.gl).setBound(this.AMBIENT_MAP_TEXTURE_BOUND).fromImage(component.material.ambientMapUrl).setWrap(this.gl.REPEAT)
            ambientTexturesMap[ambientMapUrl] = ambientMapTexture
          } else {
            ambientMapTexture = ambientTexturesMap[ambientMapUrl]
          }
          component.ambientMapTexture = ambientMapTexture
        }

        if (typeof diffuseMapUrl === 'undefined') {
          component.diffuseMapTexture = null
        } else {
          var diffuseMapTexture
          if (!diffuseTexturesMap.has(diffuseMapUrl)) {
            diffuseMapTexture = new Texture(this.gl).setBound(this.DIFFUSE_MAP_TEXTURE_BOUND).fromImage(component.material.diffuseMapUrl).setWrap(this.gl.REPEAT)
            diffuseTexturesMap[diffuseMapUrl] = diffuseMapTexture
          } else {
            diffuseMapTexture = diffuseTexturesMap[diffuseMapUrl]
          }
          component.diffuseMapTexture = diffuseMapTexture
        }
      }
    }
  }

  onDraw () {
    if (!this.fileLoaded) {
      return
    }
    this.vao.bind()
    for (var i in this.components) {
      var component = this.components[i]
      if (component.diffuseMapTexture !== null) {
        component.diffuseMapTexture.bind()
      }
      if (component.ambientMapTexture !== null) {
        component.ambientMapTexture.bind()
      }

      this.technique.setMaterial({
        illum: component.material.illum,
        ambientColor: component.material.ambientColor,
        ambientMapEnabled: component.ambientMapTexture !== null,
        diffuseColor: component.material.diffuseColor,
        diffuseMapEnabled: component.diffuseMapTexture !== null,
        specularColor: component.material.specularColor,
        specularSmoothness: component.material.specularSmoothness
      })
      this.gl.drawArrays(this.gl.TRIANGLES, component.startIndex, component.count)
    }
  }
}
