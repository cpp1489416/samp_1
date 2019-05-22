<template>
  <v-container justify-space-between fluid grid-list-md style="height:100%; position:absolute; ">
    <el-row :gutter="20" style="margin-bottom:10px;" ref="row_1">
      <el-col :span="24">
        <h1 class="text-md-left" style="display:inline-block;">主卧</h1>
        <v-btn color="#7986CB" dark style="position:absolute;bottom:10px;right:0;" @click="$router.back()">返回</v-btn>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:40px;" ref="row_2" v-loading="loading"> 
      <el-col v-for="(component, index) in components" :key="index" :span="6 ">
        <v-card style="height:100%">
          <v-img
            class="white--text"
            height="200px"
            :src="require('@/assets/imgs/main.jpg')"
          >
            <v-container fill-height fluid >
              <v-layout fill-height align-end>
                <v-flex xs12 align-end flexbox>
                  <span class="headline" style="font-size: 40px !important; float:right;">{{component.display}}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
          <v-card-title>
            <div class="text-truncate">
              <span> {{component.notification}}</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions style="padding-top:20px;padding-bottom:20px;">
            <v-text-field 
              v-show="typeof component.temperature !== 'undefined'" 
              label="温度" 
              width="20px"
              style="float:left;position:absolute"
              v-model="component.temperature"
              :disabled="!component.on"
              @change="toggleTemperature(component)"
            >温度</v-text-field>
            <v-spacer></v-spacer>
            <v-btn bordered color="#7986CB" dark @click="toggleComponent(component)">{{component.on ? '关' : '开' }}</v-btn>
          </v-card-actions>
        </v-card>
      </el-col>
    </el-row>
    <el-row ref="row_3" :span="20" :style="{height:row_3_height}"> 
      <el-col :span="24" style="height:100%" v-loading="loading">
        <v-btn style="position:absolute; z-index:10000; right:25px; top:10px;" @click="clearHistory">清空历史记录</v-btn>
        <v-card style="height:100%;overflow-y:scroll" ref="notifications">
          <v-list>
            <template v-for="(item, index) in notifications">
              <v-list-tile :key="index" avatar ripple @click="back">
                  <v-list-tile-sub-title class="text--primary">{{item}}</v-list-tile-sub-title>
              </v-list-tile>
               <v-divider v-if="index + 1 < notifications.length" :key="`divider-${index}`"></v-divider>
            </template>
          </v-list>
        </v-card>
      </el-col>
    </el-row>
  </v-container>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  methods: {
    next () {
      const active = parseInt(this.active)
      this.active = (active < 2 ? active + 1 : 0)
    }
  },
  data() {
    return {
      components: [
        {
          display: '灯',
          on: false,
          notification: '灯已经关闭',
        },
        {
          display: '床头灯',
          on: false,
          notification: '床头灯已经关闭'
        },
        {
          display: '电视',
          on: false,
          notification: '电视已经关闭',
        },
        {
          display: '空调',
          on: false,
          temperature: 26,
          notification: '空调已经关闭'
        },

      ] ,
      notifications: [
      ],
      row_3_height: '10px',
      resizeFunction: null,
      loading: true
    }
  },
  methods: {
    back() {},
    getTime() {
      var date = new Date();
      var year = date.getFullYear();
      var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return date.getHours() + ':' + m
    },
    scrollToBottom() {
      this.$nextTick(() => {
          var container = this.$refs.notifications.$el;
          container.scrollTop = container.scrollHeight;
      });
    },
    async toggleComponent(component) {
      this.loading = true
      let notify
      if (component.on) {
        notify = component.display + '已经关闭，关闭时间：' + this.getTime()
        component.on = false
      } else {
        if (typeof component.temperature == 'undefined') {
          notify = component.display + '已经打开，打开时间：' + this.getTime()
        } else {
          notify = component.display + '已经打开， '+ '设置温度' +
           component.temperature + '摄氏度，打开时间：' + this.getTime()
        }
        component.on = true
      }
      this.notifications.push(notify)
      component.notification = notify
      await this.commit()
      this.scrollToBottom()
    },
    async toggleTemperature(component) {
      let notify = component.display + '温度已经改变，温度：' + component.temperature + '摄氏度，改变时间：' + this.getTime()
      this.notifications.push(notify)
      component.notification = notify
      await this.commit()
      this.scrollToBottom()
    },
    async update() {
      this.loading = true
      await this.ajax.get('/room1').then(response => {
        this.components[0].on = response.info.light.on
        if (response.info.light.on) { this.components[0].notification = '灯已经打开' }
        this.components[1].on = response.info.besideLamp.on
        if (response.info.besideLamp.on) { this.components[1].notification = '床头灯已经打开' }
        this.components[2].on = response.info.tv.on
        if (response.info.tv.on) { this.components[2].notification = '电视已经打开' }
        this.components[3].on = response.info.airConditioner.on
        if (response.info.airConditioner.on) { this.components[3].notification = '空调已经打开' }
        this.notifications = response.info.history
      })
      this.loading =false
    },
    async commit() {
      this.loading = true
      await this.ajax.put('/room1', {
        light: { on: this.components[0].on },
        besideLamp: { on: this.components[1]. on },
        tv: { on: this.components[2].on },
        airConditioner: { on: this.components[3].on, temperature: this.components[3].temperature },
        history: this.notifications
      }).then(() => {
        this.$notify({
          type: 'success',
          message: '已提交',
          offset: 100
        })
      })
      this.loading = false
    },
    async clearHistory() {
      this.loading = true
      this.notifications = []
      await this.commit()
      this.loading = false
    }
  },
  mounted () {
    var that = this
    this.resizeFunction = function () {
      const top = that.$refs.row_2.$el.offsetHeight + that.$refs.row_2.$el.offsetTop;
      that.row_3_height = 'calc(100% - 40px - ' + top + 'px)'
    }
    window.addEventListener('resize', this.resizeFunction)
    this.resizeFunction()
    this.update()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFunction)
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}

</style>

