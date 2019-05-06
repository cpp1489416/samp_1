import Technique from '../common/Technique'
import Shader from '../common/Shader'
import Program from '../common/Program'
import vs_code from '@/assets/shaders/rtt_vertex_shader.glsl'
import ps_code from '@/assets/shaders/rtt_fragment_shader.glsl'

export default class RttTechnique extends Technique {
  onCreate () {
    this.vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER).compile(vs_code)
    this.fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER).compile(ps_code)
    this.program = new Program(this.gl)
    this.program.addShader(this.vertexShader).addShader(this.fragmentShader).link()
  }

  getPositionAttribute () { return this.getAttributeLocation('position') }
  getTextureCoordAttribute () { return this.getAttributeLocation('textureCoord') }
  getProjectionMatrixUniform () { return this.getUniformLocation('projectionMatrix') }
  getRttProjectionMatrixUniform () { return this.getUniformLocation('rttProjectionMatrix') }
  getRttViewMatrixUniform () { return this.getUniformLocation('rttViewMatrix') }
  getViewMatrixUniform () { return this.getUniformLocation('viewMatrix') }
  getModelMatrixUniform () { return this.getUniformLocation('modelMatrix') }
  getSamplerUniform () { return this.getUniformLocation('pictures') }

  getThingRequirement () {
    return {
      needColor: false,
      needNormal: false,
      needTexture: false
    }
  }

  setRttCamera (rttCamera) {
    this.rttCamera = rttCamera
    this.setRttProjectionMatrix(this.rttCamera.getProjectionMatrix())
    this.setRttViewMatrix(this.rttCamera.getViewMatrix())
  }

  setRttProjectionMatrix (projectionMatrix) {
    this.getProgram().bind()
    var rttProjectionId = this.getRttProjectionMatrixUniform()
    this.gl.uniformMatrix4fv(rttProjectionId, this.gl.FALSE, projectionMatrix)
  }

  setRttViewMatrix (viewMatrix) {
    this.getProgram().bind()
    var rttViewId = this.getRttViewMatrixUniform()
    this.gl.uniformMatrix4fv(rttViewId, this.gl.FALSE, viewMatrix)
  }
}
