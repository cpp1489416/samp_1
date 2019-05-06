import Technique from '../common/Technique'
import Shader from '../common/Shader'
import Program from '../common/Program'
import vs_code from '@/assets/shaders/main_vertex_shader.glsl'
import ps_code from '@/assets/shaders/main_fragment_shader.glsl'

export default class extends Technique {
  onCreate () {
    this.vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER).compile(vs_code)
    this.fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER).compile(ps_code)
    this.program = new Program(this.gl)
    this.program.addShader(this.vertexShader).addShader(this.fragmentShader).link()
    this.locations = {
      attributes: {
        position: this.getAttributeLocation('position'),
        textureCoord: this.getAttributeLocation('textureCoord'),
        normal: this.getAttributeLocation('normal')
      },
      uniforms: {
        normalMatrix: this.getUniformLocation('normalMatrix'),
        ambientLightIntensity: this.getUniformLocation('ambientLightIntensity'),
        eyePosition: this.getUniformLocation('eyePosition'),
        projectionMatrix: this.getUniformLocation('projectionMatrix'),
        viewMatrix: this.getUniformLocation('viewMatrix'),
        modelMatrix: this.getUniformLocation('modelMatrix'),
        ambientMap: this.getUniformLocation('ambientMap'),
        diffuseMap: this.getUniformLocation('diffuseMap'),
        clipPlane0: {
          enabled: this.getUniformLocation('clipPlane0.enabled'),
          plane: this.getUniformLocation('clipPlane0.plane')
        },
        material: {
          illum: this.getUniformLocation('material.illum'),
          diffuseColor: this.getUniformLocation('material.diffuseColor'),
          diffuseMapEnabled: this.getUniformLocation('material.diffuseMapEnabled'),
          ambientColor: this.getUniformLocation('material.ambientColor'),
          ambientMapEnabled: this.getUniformLocation('material.ambientMapEnabled'),
          specularColor: this.getUniformLocation('material.specularColor'),
          specularSmoothness: this.getUniformLocation('material.specularSmoothness'),
          normalExist: this.getUniformLocation('material.normalExist')
        },
        directionLight: {
          enabled: this.getUniformLocation('directionLight.enabled'),
          direction: this.getUniformLocation('directionLight.direction'),
          color: this.getUniformLocation('directionLight.color'),
          intensity: this.getUniformLocation('directionLight.intensity')
        }
      }
    }
    this.setClipPlane0(null)
    this.setDirectionLight(null)

    this.gl.uniform1i(this.locations.uniforms.ambientMap, 0)
    this.gl.uniform1i(this.locations.uniforms.diffuseMap, 1)
  }

  drawThings () {
    this.getProgram().bind()
    this.updateProjectionMatrixAndViewMatrix()
    this.setEyePosition(this.getCamera().getPosition())
    for (var i in this.things) {
      var thing = this.things[i]
      this.getProgram().bind()
      this.updateModelMatrix(thing.transform.getMatrix())
      this.setNormalMatrix(thing.transform.getNormalMatrix())
      thing.draw()
    }
  }

  getPositionAttribute () { return this.locations.attributes.position }
  getTextureCoordAttribute () { return this.locations.attributes.textureCoord }
  getNormalAttribute () { return this.locations.attributes.normal }
  getProjectionMatrixUniform () { return this.locations.uniforms.projectionMatrix }
  getViewMatrixUniform () { return this.locations.uniforms.viewMatrix }
  getModelMatrixUniform () { return this.locations.uniforms.modelMatrix }
  getSamplerUniform () { return null }
  getAmbientMapTextureBound () { return 0 }
  getDiffuseMapTextureBound () { return 1 }

  setNormalMatrix (matrix) {
    this.gl.uniformMatrix4fv(this.locations.uniforms.normalMatrix, this.gl.FALSE, matrix)
  }

  setEyePosition (position) {
    this.getProgram().bind()
    this.gl.uniform3fv(this.locations.uniforms.eyePosition, position)
  }

  setClipPlane0 (plane) {
    this.getProgram().bind()
    if (plane === null || plane.enabled === 0 || plane.enabled === false) {
      this.gl.uniform1i(this.locations.uniforms.clipPlane0.enabled, 0)
    } else {
      this.gl.uniform1i(this.locations.uniforms.clipPlane0.enabled, 1)
      let finalPlane
      if (typeof plane.plane !== 'undefined') {
        finalPlane = plane.plane
      } else {
        finalPlane = plane
      }
      this.gl.uniform4fv(this.locations.uniforms.clipPlane0.plane, finalPlane)
    }
  }

  setAmbientLightIntensity (intensity) {
    this.getProgram().bind()
    this.gl.uniform1f(this.locations.uniforms.ambientLightIntensity, intensity)
  }

  setMaterial (material) {
    this.getProgram().bind()
    // illum
    this.gl.uniform1i(this.locations.uniforms.material.illum, material.illum)

    // ambient color
    this.gl.uniform3fv(this.locations.uniforms.material.ambientColor, material.ambientColor)
    let ambientMapEnabled = material.ambientMapEnabled
    if (typeof material.ambientMapEnabled === 'boolean') {
      ambientMapEnabled = material.ambientMapEnabled ? 1 : 0
    }
    this.gl.uniform1i(this.locations.uniforms.material.ambientMapEnabled, ambientMapEnabled)

    if (material.illum >= 1) {
      // diffuse color
      this.gl.uniform3fv(this.locations.uniforms.material.diffuseColor, material.diffuseColor)
      let diffuseMapEnabled = material.diffuseMapEnabled
      if (typeof material.diffuseMapEnabled === 'boolean') {
        diffuseMapEnabled = material.diffuseMapEnabled ? 1 : 0
      }
      this.gl.uniform1i(this.locations.uniforms.material.diffuseMapEnabled, diffuseMapEnabled)
    }

    if (material.illum >= 2) {
      // specular color
      this.gl.uniform3fv(this.locations.uniforms.material.specularColor, material.specularColor)
      this.gl.uniform1f(this.locations.uniforms.material.specularSmoothness, material.specularSmoothness)
    }

    // normal exist
    if (typeof material.normalExist === 'undefined') {
      material.normalExist = 1
    } else if (typeof material.normalExist === 'boolean') {
      material.normalExist = material.normalExist ? 1 : 0
    }
    this.gl.uniform1i(this.locations.uniforms.material.normalExist, material.normalExist)
  }

  setDirectionLight (light) {
    this.getProgram().bind()
    if (light === null || light.enabled === 0 || light.enabled === false) {
      this.gl.uniform1i(this.locations.uniforms.directionLight.enabled, 0)
    } else {
      this.gl.uniform1i(this.locations.uniforms.directionLight.enabled, 1)
      this.gl.uniform3fv(this.locations.uniforms.directionLight.direction, light.direction)
      this.gl.uniform3fv(this.locations.uniforms.directionLight.color, light.color)
      this.gl.uniform1f(this.locations.uniforms.directionLight.intensity, light.intensity)
    }
  }

  getThingRequirement () {
    return {
      needColor: false,
      needNormal: true,
      needTexture: true
    }
  }
}
