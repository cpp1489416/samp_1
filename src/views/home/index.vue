<template>
     <v-container justify-space-between fluid grid-list-md style="height:100%; position:absolute; background-color: #f0f2f5; " >
       <el-row>
         <el-col>
           <h1>Smart Home</h1>
          </el-col>
       </el-row>
        <el-row :gutter="20" :span="24" >
          <el-col :span="4" v-for="(room, index) in rooms" :key="index" style="width: 25%!important; margin-bottom:30px;">
            <v-card>
              <v-img
                :src="room.image_url"
                height="200"
                aspect-ratio="2.75"
              ></v-img>

              <v-card-actions>
                <v-btn flat block dark color="blue" @click="$router.push(room.jump_to)">查看</v-btn>
              </v-card-actions>
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
      rooms: [
        {
          name: '客厅',
          image_url: require('@/assets/imgs/visit.jpg'),
          jump_to: '/visit_room'
        },
        {
          name: '厨房',
          image_url: require('@/assets/imgs/kitchen.jpg'),
          jump_to: '/kitchen'
        },
        {
          name: '主卧',
          image_url: require('@/assets/imgs/main.jpg'),
          jump_to: '/main_room'
        },
        {
          name: '副卧',
          image_url: require('@/assets/imgs/sub.jpg'),
          jump_to: '/sub_room'
        },
        {
          name: '卫生间',
          image_url: require('@/assets/imgs/toilet.jpg'),
          jump_to: '/toilet'
        },
      ]
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}

.el-col {
}
</style>
