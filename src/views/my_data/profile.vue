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
        <el-button type="primary" @click="modify" v-loading="modifyLoading">Modify</el-button>
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
      loading: true,
      modifyLoading: false,
      rating: 0
    }
  },
  methods: {
    async modify () {
      this.modifyLoading = true
      await this.ajax.put('/user', this.userInfo).then(response => {
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

      await this.ajax.get('/user').then(response => {
        this.userInfo = response.info
      })

      this.loading = false
    },
    back () {
      this.$router.push('/data/books')
    },
    async rate () {
    }
  },
  created () {
    this.getUser()
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
