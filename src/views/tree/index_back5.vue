<template>
  <div class="app-container">
    <el-container>
      <el-aside style="width: 1000px;">
        <canvas ref="tree" width="1000" height="500"/>
      </el-aside>
      <el-main>
        <el-button @click="repaint">repaint</el-button>
        <el-input v-model="walkDistance"/>
        <el-button @click="walk">walk</el-button>
        <el-input v-model="flyDistance"/>
        <el-button @click="fly">fly</el-button>
        <el-input v-model="strafeDistance"/>
        <el-button @click="strafe">strafe</el-button>
        <el-input v-model="pitchDistance"/>
        <el-button @click="pitch">pitch</el-button>
        <el-input v-model="yallDistance"/>
        <el-button @click="yall">yall</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Camera from '../../utils/gl/common/Camera'
import BasicTechnique from '../../utils/gl/techniques/BasicTechnique'
import Cube from '../../utils/gl/things/Cube'
import { vec3 } from 'gl-matrix'
import SkyboxTechnique from '../../utils/gl/techniques/SkyboxTechnique'
import Anchor from '../../utils/gl/things/Anchor'
import ObjMesh from '../../utils/gl/things/ObjMesh'
import TextureTechnique from '../../utils/gl/techniques/TextureTechnique'
import Quad from '../../utils/gl/things/Quad'

export default {
  data () {
    return {
      canvas: null,
      camera: null,
      cube: null,
      anchor: null,
      technique: null,
      textureTechnique: null,
      skyboxTechnique: null,
      gl: null,
      quad: null,
      now: 1,
      walkDistance: 1,
      flyDistance: 1,
      strafeDistance: 0,
      pitchDistance: 0,
      yallDistance: 0
    }
  },
  watch: {
    filterText (val) {
    }
  },
  mounted () {
    var canvas = this.$refs.tree
    this.canvas = canvas
    this.$nextTick(function () {
    })
  },

  methods: {
    repaint: function () {
      // 获取canvas元素
      // 获取绘制二维上下文
      var gl = this.canvas.getContext('webgl2')
      this.gl = gl
      if (!gl) {
        return
      }
      this.initGl()
      this.paintGl()
    },

    initGl: async function () {
      this.camera = new Camera(this.gl)
      this.camera.lookAt([50, 50, -50], [0, 1, 0], [0, 1, 0])
      // this.camera.perspective(-50, 50, 50, -50, -4.3, 500)
      this.camera.perspective2(3.14 / 2 / 2, 0.1, 10000)
      this.camera.setAspect(2)
      this.camera.transformType = Camera.TransformType.LandObject

      this.cube = new Cube(this.gl)
      this.anchor = new Anchor(this.gl)
      this.anchor.transform.scale = vec3.fromValues(2, 2, 2)

      this.mesh = new ObjMesh(this.gl, '/static/models/pancat/pancat.obj')
      this.mesh.transform.scale[2] = -1
      this.quad = new Quad(this.gl)

      this.technique = new BasicTechnique(this.gl)

      this.technique.addComponent(this.camera)
      // this.technique.addComponent(this.cube)
      // this.technique.addComponent(this.anchor)

      this.textureTechnique = new TextureTechnique(this.gl)
      this.textureTechnique.addComponent(this.camera)
      // this.textureTechnique.addComponent(this.quad)
      this.textureTechnique.addComponent(this.mesh)

      this.gl.clearColor(0, 0.5, 0, 1)
      // this.gl.enable(this.gl.CULL_FACE)
      // this.gl.frontFace(this.gl.CW)
      this.gl.enable(this.gl.DEPTH_TEST)
      this.gl.depthFunc(this.gl.LESS)
      // this.gl.depthMask(this.gl.TRUE)
      // this.gl.enable(this.gl.DEPTH_CLAMP)

      this.skyboxTechnique = new SkyboxTechnique(this.gl)
      this.skyboxTechnique.camera = this.camera
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
      setInterval(this.timePass, 100)
    },

    paintGl: function () {
      this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)
      this.skyboxTechnique.drawThings()
      this.technique.drawThings()
      this.textureTechnique.drawThings()
    },

    timePass: function () {
      this.paintGl()
      return
      if (this.mesh !== null) {
        this.now += 0.1
        this.mesh.transform.rotation = vec3.fromValues(this.now, this.now, this.now)
      }
    },
    walk () {
      this.camera.walk(Number(this.walkDistance))
    },
    fly () {
      this.camera.fly(Number(this.flyDistance))
    },
    strafe () {
      this.camera.strafe(Number(this.strafeDistance))
    },
    pitch () {
      this.camera.pitch(Number(this.pitchDistance))
    },
    yall () {
      this.camera.yall(Number(this.yallDistance))
    }
  }
}
</script>
