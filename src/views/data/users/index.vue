<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" v-model="queryParams.name" placeholder="name"
                @keyup.native.enter="reloadPage"/>
      <el-input style="width: 200px;" class="filter-item" v-model="queryParams.location" placeholder="location"
                @keyup.native.enter="reloadPage"/>
      <el-select v-model="queryParams.order_by" class="filter-item">
        <el-option v-for="item in orderBys" :value="item" :key="item"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reloadPage"> Search</el-button>
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
      <el-table-column label="name">
        <template slot-scope="scope">
          {{ scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="location" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="age" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column label="" width="330" align="center">
        <template slot-scope="scope">
          <el-button size='mini' @click="$router.push('/data/users/' + scope.row.id + '/ratings')">ratings</el-button>
          <el-button size='mini' @click="jumpToRecommendations(scope.row.id)">recommendations</el-button>
          <el-button size='mini' @click="jumpToProfile(scope.row.id)">profile</el-button>
        </template>
      </el-table-column>
      <el-table-column label="id" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}
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
      orderBys: [
        'id', '-id', 'age', '-age'
      ]
    }
  },
  created () {
    this.reloadPage()
  },
  methods: {
    getList: function (info) {
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
      this.ajax.get('/users', {
        params: this.queryParams
      }).then(response => {
        this.count = response.info.count
        this.content = response.info.content
        this.listLoading = false
      }, function () {
      })
    },
    reloadPage: function () {
      this.getList()
    },
    jumpToRecommendations (user_id) {
      this.$router.push({
        path: '/data/users/' + user_id + '/recommendations'
      })
    },
    jumpToProfile (user_id) {
      this.$router.push({
        path: '/data/users/' + user_id + '/profile'
      })
    }
  },
  components: {
    Pagination
  }
}
</script>
