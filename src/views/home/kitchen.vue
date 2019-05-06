<template>
  <v-container justify-space-between fluid grid-list-md style="height:100%; position:absolute; background-color: #f0f2f5; ">
    <el-row :gutter="20" style="margin-bottom:10px;" ref="row_1">
      <el-col :span="24">
        <h1 class="text-md-left" style="display:inline-block;">厨房</h1>
        <v-btn color="#7986CB" dark style="position:absolute;bottom:10px;right:0;" @click="$router.back()">返回</v-btn>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:40px;" ref="row_2"> 
      <el-col v-for="(component, index) in components" :key="index" :span="6  ">
        <v-card style="height:100%">
          <v-img
            class="white--text"
            height="200px"
            :src="require('@/assets/imgs/kitchen.jpg')"
          >
            <v-container fill-height fluid >
              <v-layout fill-height align-end>
                <v-flex xs12 align-end flexbox>
                  <span class="headline" style="font-size: 40px !important;">{{component.display}}</span>
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
              style="float:left;position:absolute"
              v-model="component.temperature"
              :disabled="!component.on"
              @change="toggleTemperature(component)"
            >温度</v-text-field>
            <v-spacer></v-spacer>
            <v-btn bordered color="#7986CB" dark @click="toggleComponent(component)">{{component.buttonCaption}}</v-btn>
          </v-card-actions>
        </v-card>
      </el-col>
    </el-row>
    <el-row ref="row_3" :span="20" :style="{height:row_3_height}"> 
      <el-col :span="24" style="height:100%">
        <v-card style="height:100%;overflow-y:scroll" ref="kitchenNotifications">
          <v-list>
            <template v-for="(item, index) in notifications">
              <v-list-tile :key="index" avatar ripple @click="">
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
          display: '电饭煲',
          buttonCaption: '煮饭',
          on: false,
          notification: '电饭煲已经关闭，关闭时间：' + this.getTime(),
        },
        {
          display: '微波炉',
          buttonCaption: '加热',
          on: false,
          notification: '微波炉已经关闭，关闭时间：' + this.getTime(),
        },
        {
          display: '油烟机',
          buttonCaption: '打开',
          on: false,
          notification: '油烟机已经关闭，关闭时间：' + this.getTime(),
        },
        {
          display: '灯',
          buttonCaption: '打开',
          on: false,
          notification: '灯已经关闭，关闭时间：' + this.getTime(),
        },

      ] ,
      notifications: [
      ],
      row_3_height: '10px'

    }
  },
  methods: {
    getTime() {
      var date = new Date();
      var year = date.getFullYear();
      var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return date.getHours() + ':' + m
    },
    scrollToBottom() {
      this.$nextTick(() => {
          var container = this.$refs.kitchenNotifications.$el;
          container.scrollTop = container.scrollHeight;
      });
    },
    toggleComponent(component) {
      let notify
      if (component.on) {
        notify = component.display + '已经关闭，关闭时间：' + this.getTime()
        component.on = false
        component.buttonCaption = '关闭'
      } else {
        if (typeof component.temperature == 'undefined') {
          notify = component.display + '已经打开，打开时间：' + this.getTime()
        } else {
          notify = component.display + '已经打开， '+ '设置温度' +
           component.temperature + '摄氏度，打开时间：' + this.getTime()
        }
        component.on = true
        component.buttonCaption = '打开'
      }
      this.notifications.push(notify)
      component.notification = notify
      switch (component.display) {
        case '电饭煲':
          this.toggleDianFanBao(component)
          break;
        case '微波炉':
          this.toggleWeiBoNu(component)
          break;
        case '油烟机':
          this.toggleYouYanJi(component)
          break;
        case '灯':
          this.toggleDeng(component)
          break;
      }
      this.scrollToBottom()
    },
    toggleDianFanBao(component) {
      if (component.on) {
        component.buttonCaption = '关闭'
        component.notification = '正在煮饭'
      } else {
        component.buttonCaption = '煮饭'
      }
    },
    toggleWeiBoNu(component) {
      if (component.on) {
        component.buttonCaption = '关闭'
        component.notification = '正在加热'
      } else {
        component.buttonCaption = '加热'
      }

    },
    toggleYouYanJi(component) {
      if (component.on) {
        component.buttonCaption = '关闭'
      } else {
        component.buttonCaption = '打开'
      }
    },
    toggleDeng(component) {
      if (component.on) {
        component.buttonCaption = '关闭'
      } else {
        component.buttonCaption = '打开'
      }
    },
    toggleTemperature(component) {
      let notify = component.display + '温度已经改变，温度：' + component.temperature + '摄氏度，改变时间：' + this.getTime()
      this.notifications.push(notify)
      component.notification = notify
      this.scrollToBottom()
    }
  },
  mounted () {
    var that = this
    var resize = function () {
      const top = that.$refs.row_2.$el.offsetHeight + that.$refs.row_2.$el.offsetTop;
      that.row_3_height = 'calc(100% - 40px - ' + top + 'px)'
    }
    window.addEventListener('resize', resize)
    resize()
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}

</style>
