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
      <!--
      <el-data-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-data-column>
      -->
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
          {{username}}
        </template>
      </el-table-column>
      <el-table-column label="Rating" width="200">
        <template slot-scope="scope">
          <el-rate
            disabled
            show-score
            v-model="scope.row.rating"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
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
import mapGetters from 'vuex'

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
  created () {
    this.userId = this.$route.params.id
    this.reloadPage()
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
      await this.ajax.get('/users/' + this.$route.params.id).then(response => {
        this.username = response.info.name
      })
      await this.ajax.get('/users/' + this.$route.params.id + '/ratings', {
        params: this.queryParams
      }).then(response => {
        this.count = response.info.count
        this.content = response.info.content
        this.listLoading = false
      }, function () {
      })
    },
    reloadPage: function () {
      if (this.userId === '') {
        this.userId = '1'
      }
      if (this.$route.params.id !== this.userId) {
        this.$router.push('/example/rates_of_user/' + this.userId)
      }
      this.getList()
    }
  },
  components: {
    Pagination
  }
}
</script>
