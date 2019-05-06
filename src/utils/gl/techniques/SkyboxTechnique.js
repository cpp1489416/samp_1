import Camera from '../common/Camera'
import Technique from '../common/Technique'
import vertex_shader_src from '@/assets/shaders/SkyboxVertexShader.glsl'
import fragment_shader_src from '@/assets/shaders/SkyboxFragmentShader.glsl'
import Shader from '../common/Shader'
import Program from '../common/Program'
import { mat4 } from 'gl-matrix'
import Skybox from '../things/Skybox'

export default class extends Technique {
  onCreate () {
    var vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER).compile(vertex_shader_src)
    var fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER).compile(fragment_shader_src)
    this.program = new Program(this.gl).addShader(vertexShader).addShader(fragmentShader).link()
    this.skybox = new Skybox(this.gl)
    this.addThing(this.skybox)
  }

  addComponent (component) {
    if (component instanceof Camera) {
      this.camera = component
    }
  }
  drawThings () {
    this.getProgram().bind()
    this.updateProjectionMatrixAndViewMatrix()
    this.skybox.draw()
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
  }

  updateProjectionMatrixAndViewMatrix () {
    var projectionId = this.getProjectionMatrixUniform()
    var viewId = this.getViewMatrixUniform()
    this.gl.uniformMatrix4fv(projectionId, this.gl.FALSE, this.camera.getProjectionMatrix())
    this.gl.uniformMatrix4fv(viewId, this.gl.FALSE, this.camera.getSkyboxViewMatrix())
  }

  getProgram () { return this.program } // get current program
  getPositionAttribute () { return this.getAttributeLocation('position') }
  getTextureCoordAttribute () { return this.getAttributeLocation('textureCoord') }
  getProjectionMatrixUniform () { return this.getUniformLocation('projection') }
  getViewMatrixUniform () { return this.getUniformLocation('view') }
  getLightIntensitiesUniform () { return 0 }
  getTexture2DUniform () { return 0 }
  getTextureId () { return 0 }

  onAddThing (thing) {}

  getThingRequirement () {
    return {
      needColor: false,
      needNormal: false,
      needTexture: true
    }
  }
}
