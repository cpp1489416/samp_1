<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :model="userInfo" label-width="120px" v-loading="loading">
      <el-form-item label="Login Name">
        <el-input v-model="userInfo.username"/>
      </el-form-item>
      <el-form-item label="Name">
        <el-input v-model="userInfo.name"/>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="userInfo.email"/>
      </el-form-item>
      <el-form-item label="Location">
        <el-input v-model="userInfo.location"/>
      </el-form-item>
      <el-form-item label="Age">
        <el-input v-model="userInfo.age"/>
      </el-form-item>
      <el-form-item label="Avatar Url">
        <el-input v-model="userInfo.avatar_url"/>
      </el-form-item>
      <el-form-item label="Avatar">
        <img :src="userInfo.avatar_url" height="100px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="modify" v-if="user.role !== 0" v-loading="modifyLoading">Modify</el-button>
        <el-button type="primary" @click="jumpToRecommendations" v-loading="modifyLoading"> Recommendations </el-button>
        <el-button @click="back">Back</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'username', 'user'
    ])
  },
  data () {
    return {
      userInfo: {
        username: '',
        name: '',
        email: '',
        location: '',
        age: 0,
        avatar_url: ''
      },
      userId: 0,
      loading: true,
      modifyLoading: false,
      rating: 0
    }
  },
  methods: {
    async modify () {
      this.modifyLoading = true
      await this.ajax.put('/users/' + this.userId, this.userInfo).then(response => {
        this.userInfo = response.info
        this.$notify({
          message: 'modified',
          type: 'success'
        })
      })
      this.modifyLoading = false
    },
    async getUser () {
      this.loading = true

      await this.ajax.get('/users/' + this.userId).then(response => {
        this.userInfo = response.info
      })

      this.loading = false
    },
    back () {
      this.$router.push('/data/books')
    },
    jumpToRecommendations () {
      this.$router.push('/data/users/' + this.userId + '/recommendations')
    }
  },
  created () {
    this.userId = this.$route.params.id
    this.getUser()
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
