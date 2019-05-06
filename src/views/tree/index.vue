<template>
  <div class="app-container">
    <el-container>
      <el-aside style="width: 1000px;">
        <canvas ref="tree" width="1000" height="500" tabindex="0"/>
      </el-aside>
      <el-main>
        <el-button @click="repaint">repaint</el-button>
        <v-switch
          v-model="rotating"
          active-text="rotating"
          inactive-text="static"/>
        <v-text-field v-model="walkDistance"/>
        <v-btn @click="walk">walk</v-btn>
        <v-text-field v-model="flyDistance"/>
        <v-btn @click="fly">fly</v-btn>
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
import scene1 from './scene1'
import SceneBuilder from '../../utils/gl/SceneBuilder'

export default {
  data () {
    return {
      canvas: null,
      sceneBuilder: null,
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
  mounted () {
    var canvas = this.$refs.tree
    this.canvas = canvas
    this.initScene()
    this.canvas.addEventListener('mousedown', this.onCanvasMouseDown, false)
    this.canvas.addEventListener('mousemove', this.onCanvasMouseMove, false)
    this.canvas.addEventListener('mouseup', this.onCanvasMouseUp, false)
    this.canvas.addEventListener('keydown', this.onCanvasKeyDown, false)
  },

  methods: {
    repaint () {
      window.location.reload()
    },

    initScene () {
      this.gl = this.canvas.getContext('webgl2')
      this.sceneBuilder = new SceneBuilder()
        .setGl(this.gl)
        .setSize(this.canvas.width, this.canvas.height)
        .setConfig(scene1)
        .build()
      this.scene = this.sceneBuilder.getScene()
      this.mesh = this.sceneBuilder.getModel('mesh')
      this.mirror = this.sceneBuilder.getModel('mirror')
      this.mirror2 = this.sceneBuilder.getModel('mirror2')
      this.anchor = this.sceneBuilder.getModel('anchor')
      this.camera = this.sceneBuilder.getCamera()
      this.reflectedCamera = new PlaneReflectedCamera(this.camera)
      this.scene.addComponent(this.reflectedCamera)
      setInterval(this.timePass, 100)
    },

    paintGl () {
      this.scene.draw()
    },

    timePass () {
      if (this.mesh !== null && this.rotating) {
        this.now += 5
        this.mesh.transform.setRotation(quat.fromEuler(quat.create(), 0, this.now, 0))
      }
      this.paintGl()
    },
    onCanvasMouseDown (e) {
      if (e.button === 0) {
        this.leftButtonPressed = true
      }
    },
    onCanvasMouseMove (e) {
      if (this.leftButtonPressed) {
        this.camera.yall(-e.movementX / 400.0)
        this.camera.pitch(-e.movementY / 400.0)
      }
    },
    onCanvasMouseUp (e) {
      this.leftButtonPressed = false
    },
    onCanvasKeyDown (e) {
      switch (e.key) {
        case 'w':
          this.camera.walk(-1)
          break
        case 's':
          this.camera.walk(1)
          break
        case 'a':
          this.camera.strafe(-1)
          break
        case 'd':
          this.camera.strafe(1)
          break
        default:
          break
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
