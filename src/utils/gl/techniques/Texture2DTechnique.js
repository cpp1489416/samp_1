import Technique from '../common/Technique'
import Shader from '../common/Shader'
import Program from '../common/Program'
import vs_code from '@/assets/shaders/Texture2DVS.glsl'
import ps_code from '@/assets/shaders/Texture2DPS.glsl'

export default class extends Technique {
  onCreate () {
    this.vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER).compile(vs_code)
    this.fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER).compile(ps_code)
    this.program = new Program(this.gl)
    this.program.addShader(this.vertexShader).addShader(this.fragmentShader).link()
  }

  getProgram () { return this.program }
  getPositionAttribute () { return this.getAttributeLocation('position') }
  getProjectionMatrixUniform () { return this.getUniformLocation('projectionMatrix') }
  getViewMatrixUniform () { return this.getUniformLocation('viewMatrix') }
  getModelMatrixUniform () { return this.getUniformLocation('modelMatrix') }
  getTexture2DUniform () { return this.getUniformLocation('picture') }

  getThingRequirement () {
    return {
      needColor: true,
      needNormal: false,
      needTexture: true
    }
  }
}
