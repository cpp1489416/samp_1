import Scanner from './Scanner'
import axios from 'axios'

export default class ObjMeshScanner {
  constructor (url) {
    this.url = url
    this.gened = false
  }

  async genBuffers () {
    var res = await axios.get(this.url)
    var scanner = new Scanner(res.data)
    this.positions = []
    this.textureCoords = []
    this.normals = []
    this.finalPositions = []
    this.finalColors = []
    this.finalTextureCoords = []
    this.finalNormals = []
    this.components = []
    this.count = 0
    while (scanner.hasNextExpectCommont()) {
      var word = scanner.nextExpectCommont()
      if (word === 'v') {
        this.positions.push(scanner.nextNumber(), scanner.nextNumber(), scanner.nextNumber())
      } else if (word === 'vt') { // texture
        this.textureCoords.push(scanner.nextNumber(), scanner.nextNumber())
        scanner.jumpToNextLine()
      } else if (word === 'vn') { // normal
        this.normals.push(scanner.nextNumber(), scanner.nextNumber(), scanner.nextNumber())
      } else if (word === 'f') {
        for (var i = 0; i < 3; ++i) {
          var numbers = scanner.numbersBetweenChar('/')
          var pi = numbers[0]
          var ti = numbers[1]
          var ni = numbers[2]
          this.finalPositions.push(
            this.positions[(pi - 1) * 3], this.positions[(pi - 1) * 3 + 1], this.positions[(pi - 1) * 3 + 2]
          )
          this.finalTextureCoords.push(
            this.textureCoords[(ti - 1) * 2], this.textureCoords[(ti - 1) * 2 + 1], 0
          )
          this.finalNormals.push(
            this.normals[(ni - 1) * 3], this.normals[(ni - 1) * 3 + 1], this.normals[(ni - 1) * 3 + 2]
          )
          this.finalColors.push(0, 1, 1)
          this.count++
        }
      } else if (word === 'mtllib') {
        await this.genFromMtl(scanner.nextExpectCommont())
        scanner.jumpToNextLine()
      } else if (word === 'usemtl') {
        if (this.components.length !== 0) {
          const com = this.components[this.components.length - 1]
          com.count = this.count - com.startIndex
        }
        const startIndex = this.count
        this.components.push({
          startIndex: startIndex,
          material: this.matrialsMap[scanner.nextExpectCommont()]
          // textureCoordExist: typeof this.finalNormals[startIndex] !== 'undefined',
          // normalExist: (typeof this.finalNormals[startIndex] !== 'undefined')
        })
        scanner.jumpToNextLine()
      } else {
        scanner.jumpToNextLine()
      }
    }

    if (this.components.length !== 0) {
      const com = this.components[this.components.length - 1]
      com.count = this.count - com.startIndex
    }
    this.gened = true
  }

  addToPath (url, filename) {
    var pos = url.length - 1
    while (pos > 0) {
      if (url.charAt(pos) === '/') {
        break
      }
      pos--
    }

    return url.substr(0, pos) + '/' + filename
  }

  async genFromMtl (filename) {
    var res = await axios.get(this.addToPath(this.url, filename))
    var scanner = new Scanner(res.data)

    this.matrialsMap = new Map()
    var curInfo = null
    while (scanner.hasNextExpectCommont()) {
      var word = scanner.nextExpectCommont()
      if (word === 'newmtl') {
        this.matrialsMap[scanner.nextExpectCommont()] = curInfo = {}
      } else if (word === 'map_Kd') {
        curInfo.diffuseMapUrl = this.addToPath(this.url, scanner.nextExpectCommont())
        scanner.jumpToNextLine()
      } else if (word === 'map_Ka') {
        curInfo.ambientMapUrl = this.addToPath(this.url, scanner.nextExpectCommont())
      } else if (word === 'Ka') {
        curInfo.ambientColor = [scanner.nextNumber(), scanner.nextNumber(), scanner.nextNumber()]
      } else if (word === 'Kd') {
        curInfo.diffuseColor = [scanner.nextNumber(), scanner.nextNumber(), scanner.nextNumber()]
      } else if (word === 'Ks') {
        curInfo.specularColor = [scanner.nextNumber(), scanner.nextNumber(), scanner.nextNumber()]
      } else if (word === 'Ns') {
        curInfo.specularSmoothness = scanner.nextNumber()
      } else if (word === 'illum') {
        curInfo.illum = scanner.nextNumber()
      }
    }
  }

  async getComponents () {
    if (!this.gened) {
      await this.genBuffers()
    }
    return this.components
  }

  async getOffsets () {
    if (!this.gened) {
      await this.genBuffers()
    }
    return this.matrialsOffset
  }

  async getPositions () {
    if (!this.gened) {
      await this.genBuffers()
    }

    return Float32Array.from(this.finalPositions)
  }

  async getColors () {
    if (!this.gened) {
      await this.genBuffers()
    }

    return Float32Array.from(this.finalColors)
  }

  async getTextureCoords () {
    if (!this.gened) {
      await this.genBuffers()
    }

    return Float32Array.from(this.finalTextureCoords)
  }

  async getNormals () {
    if (!this.gened) {
      await this.genBuffers()
    }
    return Float32Array.from(this.finalNormals)
  }

  async getCount () {
    if (!this.gened) {
      await this.genBuffers()
    }

    return this.count
  }
}
