<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryParams.order_by" class="filter-item">
        <el-option v-for="item in orderBys" :value="item" :key="item"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">Search</el-button>
      <el-button class="filter-item" icon="el-icon-back" @click="$router.back()">Back</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="content"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="" width="80" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.book.image_url" height="40px">
        </template>
      </el-table-column>
      <el-table-column label="Book Title" align="center" min-width="70">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push('/data/books/' + scope.row.book_id)">{{ scope.row.book.title}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="User Name" min-width="35">
        <template slot-scope="scope">
          {{user.name}}
        </template>
      </el-table-column>
      <el-table-column label="Rating" width="200">
        <template slot-scope="scope">
          <el-rate
            show-score
            v-model="scope.row.rating"
            @change="changeRating(scope.$index)"
            style="display:inline-block; margin-right:10px;"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
          <i class="el-icon-loading" v-if="scope.row.ratingSubmitting"></i>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="count"
      :page.sync="queryParams.page_number"
      :limit.sync="queryParams.page_size"
      @pagination="getList"/>
  </div>
</template>

<script>
import merge from 'webpack-merge'
import Pagination from '@/components/Pagination'
import {mapGetters} from 'vuex'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      queryParams: {
        name: null,
        location: null,
        order_by: 'id',
        page_number: 1,
        page_size: 10
      },
      count: 0,
      content: null,
      listLoading: true,
      username: '',
      orderBys: [
        'id', '-id', 'rating', '-rating', 'title', '-title', 'isbn', '-isbn'
      ],
      userId: ''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this.getList()
  },
  methods: {
    getList: async function (info) {
      this.listLoading = true
      if (info !== undefined) {
        this.queryParams.page_number = info.page
        this.queryParams.page_size = info.limit
      } else {
        this.queryParams.page_number = 1
      }
      if (this.queryParams.order_by === '') {
        this.queryParams.order_by = 'id'
      }
      await this.ajax.get('/ratings', {
        params: this.queryParams
      }).then(response => {
        this.count = response.info.count
        this.content = response.info.content
        for (var i in this.content) {
          this.content[i].ratingSubmitting = false
        }
        this.listLoading = false
      }, function () {
      })
    },
    async changeRating (index) {
      const rating = this.content[index]
      rating.ratingSubmitting = true
      this.$set(this.content, index, rating)
      await this.ajax.put('/books/' + rating.book_id + '/rating', {
        rating: rating.rating
      }).then(() => {
        this.$notify({
          message: 'rating changed',
          type: 'success'
        })
      })
      rating.ratingSubmitting = false
      this.$set(this.content, index, rating)
    }
  },
  components: {
    Pagination
  }
}
</script>
