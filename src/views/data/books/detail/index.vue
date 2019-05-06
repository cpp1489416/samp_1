<template>
  <div class="app-container" v-loading="loading">
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
      <el-form-item label="Published Year">
        <el-date-picker
          v-model="bookInfo.published_year"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Image Url">
        <el-input v-model="bookInfo.image_url"/>
      </el-form-item>
      <el-form-item label="Image">
        <img :src="bookInfo.image_url" height="100px" />
      </el-form-item>
      <el-form-item label="My Rating">
        <el-rate
          style="display:inline-block; vertical-align: center"
          v-loading="ratingLoading"
          v-model="rating"
          :disabled="ratingSubmitting"
          @change="rate"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
        </el-rate>
        <i class="el-icon-loading" v-if="ratingSubmitting"></i>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="modify" :loading="modifyLoading" :disabled="ratingSubmitting" v-if="user.role !== 0">Modify</el-button>
        <el-button type="danger" @click="remove" :loading="removeLoading" :disabled="ratingSubmitting" v-if="user.role !== 0">Remove</el-button>
        <el-button @click="jumpToRatings" :loading="modifyLoading" :disabled="ratingSubmitting" v-if="user.role !== 0">Show Others Ratings</el-button>
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
      },
      loading: true,
      modifyLoading: false,
      rating: 0,
      ratingLoading: false,
      removeLoading: false,
      ratingSubmitting: false
    }
  },
  methods: {
    async modify () {
      this.modifyLoading = true

      await this.ajax.put(
        '/books/' + this.$route.params.id,
        this.bookInfo
      ).then(reponse => {
        this.$notify({
          title: 'success',
          message: 'modified',
          type: 'success'
        })
        this.getBookInfo()
      })
      this.modifyLoading = false
      console.log(this)
    },
    async remove () {
      this.$confirm('Will you remove this book?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.removeLoading = true
        this.ajax.delete('/books/' + this.$route.params.id).then(response => {
          this.$notify({
            type: 'success',
            message: 'removed'
          })
          this.back()
        })
      }).catch(() => {
      })
    },
    getBookInfo () {
      this.loading = true
      this.ratingLoading = true
      this.rating = 0

      this.ajax.get('/books/' + this.$route.params.id, {
      }).then(response => {
        this.bookInfo = response.info
        this.loading = false
      })

      this.ajax.get('/books/' + this.$route.params.id + '/rating').then(response => {
        if (response.code === '0') {
          this.rating = response.info.rating
          this.ratingLoading = false
        } else {
          this.rating = 0
          this.ratingLoading = false
        }
      })
    },
    back () {
      this.$router.back()
    },
    async rate () {
      this.ratingSubmitting = true
      await this.ajax.put('/books/' + this.$route.params.id + '/rating', {
        rating: this.rating
      }).then(response => {
        this.$notify({
          title: 'success',
          message: 'rated',
          type: 'success'
        })
      })
      this.ratingSubmitting = false
    },
    async jumpToRatings () {
      this.$router.push('/data/books/' + this.$route.params.id + '/ratings')
    }
  },
  created () {
    this.getBookInfo()
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
