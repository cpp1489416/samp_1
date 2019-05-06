<template>
  <div class="app-container">
    <el-form ref="form" :model="bookInfo" label-width="120px">
      <el-form-item label="Title">
        <el-input v-model="bookInfo.title"/>
      </el-form-item>
      <el-form-item label="Isbn">
        <el-input v-model="bookInfo.isbn"/>
      </el-form-item>
      <el-form-item label="Author">
        <el-input v-model="bookInfo.author"/>
      </el-form-item>
      <el-form-item label="Publisher">
        <el-input v-model="bookInfo.publisher"/>
      </el-form-item>
      <el-form-item label="Published year">
        <el-date-picker
          v-model="bookInfo.published_year"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Image url">
        <el-input v-model="bookInfo.image_url"/>
      </el-form-item>
      <el-form-item label="Image">
        <img :src="bookInfo.image_url" height="100px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add" :loading="addLoading" v-if="user.role !== 0">Add</el-button>
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
      bookInfo: {
        title: '',
        isbn: '',
        author: '',
        publisher: '',
        published_year: '0000',
        image_url: ''
      },
      addLoading: false
    }
  },
  methods: {
    async add () {
      this.modifyLoading = true
      await this.ajax.post(
        '/books',
        this.bookInfo
      ).then(response => {
        this.$notify({
          title: 'success',
          message: 'added',
          type: 'success'
        })
        this.$router.push('/data/books/' + response.info.id)
      })
      this.modifyLoading = false
    },
    back () {
      this.$router.back()
    }
  },
  created () {
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
