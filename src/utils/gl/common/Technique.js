import Camera from './Camera'

export default class {
  constructor (gl) {
    this.gl = gl
    this.created = false
    this.things = []
    this.camera = null
    this.program = null
    this.create()
  }

  create () {
    if (!this.created) {
      this.created = true
      this.onCreate()
    }
  }

  destroy () { }

  addComponent (component) {
    if (component instanceof Camera) {
      this.camera = component
    } else {
      this.addThing(component)
    }
  }

  containsThing (thing) {
    for (var i in this.things) {
      if (this.things[i] === thing) {
        return true
      }
    }
    return false
  }

  getThings () {
    return this.things
  }

  getCamera () {
    return this.camera
  }

  setCamera (camera) {
    this.camera = camera
  }

  addThing (thing) {
    this.things.push(thing)
    this.onAddThing(thing)
    if (!thing.created) {
      thing.create()
      thing.createVao(this, this.getThingRequirement())
    }
  }

  drawThings () {
    this.getProgram().bind()
    this.updateProjectionMatrixAndViewMatrix()
    for (var i in this.things) {
      var thing = this.things[i]
      this.getProgram().bind()
      this.updateModelMatrix(thing.transform.getMatrix())
      thing.draw()
    }
  }

  clearThings () {
    this.things.clear()
  }

  updateModelMatrix (modelMatrix) {
    var modelMatrixId = this.getModelMatrixUniform()
    this.gl.uniformMatrix4fv(modelMatrixId, this.gl.FALSE, modelMatrix)
  }

  updateProjectionMatrixAndViewMatrix () {
    var projectionId = this.getProjectionMatrixUniform()
    var viewId = this.getViewMatrixUniform()
    this.gl.uniformMatrix4fv(projectionId, this.gl.FALSE, this.camera.getProjectionMatrix())
    this.gl.uniformMatrix4fv(viewId, this.gl.FALSE, this.camera.viewMatrix)
  }

  getAttributeLocation (name) { return this.getProgram().getAttributeId(name) }
  getUniformLocation (name) { return this.getProgram().getUniformId(name) }

  getProgram () { return this.program } // get current program
  getPositionAttribute () { return this.getAttributeLocation('position') }
  getColorAttribute () { return this.getAttributeLocation('color') }
  getTextureCoordAttribute () { return this.getAttributeLocation('textureCoord') }
  getNormalAttribute () { return this.getAttributeLocation('normal') }
  getProjectionMatrixUniform () { return this.getUniformLocation('projection') }
  getViewMatrixUniform () { return this.getUniformLocation('view') }
  getModelMatrixUniform () { return this.getUniformLocation('model') }
  getLightPositionUniform () { return this.getUniformLocation('uniform') }
  getLightIntensitiesUniform () { return 0 }
  getTexture2DUniform () { return 0 }
  getTextureId () { return 0 }
  getThingRequirement () { return {} }

  onAddThing (thing) {}
  onCreate () { }
}
