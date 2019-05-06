<template>
  <div class="app-container">
    <el-container>
      <el-aside style="width: 1000px;">
        <canvas ref="tree" width="1000" height="500"/>
      </el-aside>
      <el-main>
        <el-button @click="repaint">repaint</el-button>
        <el-switch
          v-model="rotating"
          active-text="rotating"
          inactive-text="static"/>
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
        <el-input v-model="rollDistance"/>
        <el-button @click="roll">roll</el-button>
        <el-button @click="reflect">reflect</el-button>
        <el-input v-model="rotateX"/>
        <el-input v-model="rotateY"/>
        <el-input v-model="rotateZ"/>
        <el-input v-model="rotateW"/>
        <el-button @click="rotate">rotate</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Camera from '../../utils/gl/common/Camera'
import Cube from '../../utils/gl/things/Cube'
import { vec3, mat4, quat } from 'gl-matrix'
import Anchor from '../../utils/gl/things/Anchor'
import ObjMesh from '../../utils/gl/things/ObjMesh'
import Quad from '../../utils/gl/things/Quad'
import Scene from '../../utils/gl/Scene'
import PlaneReflectedCamera from '../../utils/gl/cameras/PlaneReflectedCamera'
import BasicCamera from '../../utils/gl/cameras/BasicCamera'

import ObjMeshMirror from '../../utils/gl/things/ObjMeshMirror'

export default {
  data () {
    return {
      canvas: null,
      scene: null,
      camera: null,
      reflectedCamera: null,
      cube: null,
      gl: null,
      anchor: null,
      now: 1,
      mirror: null,
      walkDistance: 1,
      flyDistance: 1,
      strafeDistance: 1,
      pitchDistance: 0.1,
      yallDistance: 0.1,
      rollDistance: 0.1,
      rotating: false,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      rotateW: 0
    }
  },
  watch: {
    filterText (val) {
    }
  },
  mounted () {
    var canvas = this.$refs.tree
    this.canvas = canvas
    this.repaint()
  },

  methods: {
    repaint: function () {
      var gl = this.canvas.getContext('webgl2')
      this.gl = gl
      if (!gl) {
        return
      }
      this.initGl()
      this.paintGl()
    },

    initGl: async function () {
      this.camera = new BasicCamera()
      this.camera.lookAt([80, 30, -80], [0, 30, 0], [0, 1, 0])
      this.camera.perspective(3.14 / 2 / 2, 0.1, 10000)
      this.camera.ortho(-5, 5, -5, 5, 0.001, 100)
      this.camera.setAspect(2)
      this.camera.transformType = BasicCamera.TransformType.LandObject
      this.reflectedCamera = new PlaneReflectedCamera(this.camera)

      this.cube = new Cube(this.gl) // else return fasle
      this.mirror = new ObjMeshMirror(this.gl, '/static/models/mirror2/mirror.obj')
      this.mirror.transform.setPosition([21.0, 10.0, 20.0])
      this.mirror.transform.setScaling([20, 4, 1])
      this.mirror.transform.setRotation(quat.fromEuler(quat.create(), -20.0, 5.0, 5.0))

      this.mirror2 = new ObjMeshMirror(this.gl, '/static/models/mirror/mirror.obj')
      this.mirror2.transform.setScaling([2, 2, 1])
      this.mirror2.transform.setPosition([-40, 0, 0])
      this.mirror2.transform.setRotation(quat.fromEuler(quat.create(), 0, 100, 0))

      this.mesh = new ObjMesh(this.gl, '/static/models/tails/Tails.obj')
      this.mesh.transform.setPosition([20, 0, 0])
      // this.mesh.transform.setRotation()
      this.mesh.transform.setScaling([3, 3, 3])
      // this.mesh.transform.setMatrix(mat4.fromTranslation(mat4.create(), [0, 0,0]))
      // this.mesh.transform.setScaling([0.2, 0.2, 0.2])
      this.mesh2 = new ObjMesh(this.gl, '/static/models/tails/Tails.obj')
      // this.mesh2.transform.setPosition([0, 0, -40])
      this.mesh2.transform.setMatrix(mat4.fromTranslation(mat4.create(), [0, 0, -40]))

      this.anchor = new Anchor(this.gl)
      this.anchor.transform.setScaling([50, 50, 50])

      this.scene = new Scene(this.gl).setSize(this.canvas.width, this.canvas.height).setMirrorEnabled(true)
      this.scene.addComponent(this.mirror)
      this.scene.addComponent(this.mirror2)
      this.scene.addComponent(this.camera)
      this.scene.addComponent(this.mesh)
      this.scene.addComponent(this.anchor)
      //  this.scene.addComponent(this.mesh2)
      setInterval(this.timePass, 100)
    },

    paintGl: function () {
      this.scene.draw()
    },

    timePass: function () {
      if (this.mesh !== null && this.rotating) {
        this.now += 5
        this.mesh.transform.setRotation(quat.fromEuler(quat.create(), 0, this.now, 0))
      }
      this.paintGl()
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
    },
    roll () {
      this.camera.roll(Number(this.rollDistance))
    },
    reflect () {
      if (this.reflectedCamera.plane == null) {
        // alert(this.mirror.getMirrorCamera().getPlane())
        this.reflectedCamera.changePlane(this.mirror.getMirrorCamera().getPlane())
      } else {
        this.reflectedCamera.changePlane(null)
      }
    },
    rotate () {
      // this.mesh.transform.setRotation(quat.setAxisAngle(quat.create(), [this.rotateX, this.rotateY, this.rotateZ], this.rotateW))
      this.mesh.transform.setRotation(quat.fromEuler(quat.create(), this.rotateX, this.rotateY, this.rotateZ))
    }
  }
}
</script>
