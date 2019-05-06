import Transform from './Transform'

export default class {
  constructor (gl) {
    this.gl = gl
    this.created = false
    this.technique = null
    this.transform = new Transform()
    this.transform.addEventListener(this)
    this.visible = true
  }

  create () {
    if (!this.created) {
      this.created = true
      this.onCreateVbo()
    }
  }

  setVisible (visible) {
    this.visible = visible
  }

  draw () {
    if (!this.visible) {
      return
    }
    this.onDraw()
  }

  createVao (technique, requirement) {
    technique.getProgram().bind()
    this.onCreateVao(technique, requirement)
    return this
  }
}
