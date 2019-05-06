import Technique from '../common/Technique'
import Shader from '../common/Shader'
import Program from '../common/Program'
import vs_code from '@/assets/shaders/basic_vertex_shader.glsl'
import ps_code from '@/assets/shaders/basic_fragment_shader.glsl'

export default class extends Technique {
  onCreate () {
    this.vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER).compile(vs_code)
    this.fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER).compile(ps_code)
    this.program = new Program(this.gl)
    this.program.addShader(this.vertexShader).addShader(this.fragmentShader).link()
  }

  updateProjectionMatrixAndViewMatrix () {
    var projectionId = this.getProjectionMatrixUniform()
    var viewId = this.getViewMatrixUniform()
    this.gl.uniformMatrix4fv(projectionId, this.gl.FALSE, this.camera.getProjectionMatrix())
    this.gl.uniformMatrix4fv(viewId, this.gl.FALSE, this.camera.getViewMatrix())
  }

  getPositionAttribute () { return this.getAttributeLocation('position') }
  getColorAttribute () { return this.getAttributeLocation('color') }
  getProjectionMatrixUniform () { return this.getUniformLocation('projectionMatrix') }
  getViewMatrixUniform () { return this.getUniformLocation('viewMatrix') }
  getModelMatrixUniform () { return this.getUniformLocation('modelMatrix') }

  getThingRequirement () {
    return {
      needColor: true,
      needNormal: false,
      needTexture: false
    }
  }
}
