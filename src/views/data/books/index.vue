<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.isbn"
        style="width: 200px;"
        class="filter-item"
        placeholder="isbn"
        @keyup.native.enter="reloadPage"/>
      <el-input
        v-model="queryParams.title"
        style="width: 200px;"
        class="filter-item"
        placeholder="title"
        @keyup.native.enter="reloadPage"/>
      <el-select v-model="queryParams.order_by" class="filter-item">
        <el-option v-for="item in orderBys" :value="item" :key="item"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reloadPage">Search</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="jumpToAdd" v-if="user.role === 1">Add</el-button>
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
          <img :src="scope.row.image_url" height="40px">
        </template>
      </el-table-column>
      <el-table-column label="isbn" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.isbn }}
        </template>
      </el-table-column>
      <el-table-column label="title">
        <template slot-scope="scope">
          <el-button type="text" @click="jumpToBookInfo(scope.row.id)">{{ scope.row.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="year" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.published_year }}
        </template>
      </el-table-column>
      <el-table-column label="action" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type='primary' @click="openRatingDialog(scope.row)"> rate </el-button>
          <el-button size="mini" @click="jumpToRatings(scope.row.id)"> ratings </el-button>
        </template>
      </el-table-column>
      <el-table-column label="id" width="79" align="center">
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

    <el-dialog
      :visible="ratingDialog.visible"
      :title="ratingDialog.title"
      v-loading="false"
      :before-close="closeRatingDialog">
      <el-rate
        show-score
        style="text-align: center;"
        v-loading="ratingDialog.ratingLoading"
        v-model="ratingDialog.rating"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
      </el-rate>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="ratingDialog.ratingLoading" @click="rate" v-loading="ratingDialog.ratingSubmitting"> Rate </el-button>
        <el-button @click="ratingDialog.visible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import merge from 'webpack-merge'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

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
  components: {
    Pagination
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  data () {
    return {
      queryParams: {
        title: null,
        isbn: null,
        order_by: 'id',
        page_number: 1,
        page_size: 10
      },
      count: 0,
      content: null,
      listLoading: true,
      orderBys: [
        'id', '-id', 'title', '-title', 'isbn', '-isbn'
      ],
      ratingDialog: {
        book: null,
        visible: false,
        title: '',
        rating: 4,
        ratingLoading: true,
        ratingSubmitting: false
      },
      ratingDialogVisible: false,
      ratingDialogTitle: 'Rating of book ""'
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
      this.ajax.get('/books', {
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
    jumpToRatings (id) {
      this.$router.push({
        name: 'ratings_of_book',
        params: {
          id: id
        }
      })
    },
    jumpToBookInfo (book_id) {
      this.$router.push('/data/books/' + book_id)
    },
    jumpToAdd () {
      this.$router.push('/data/books/add')
    },
    openRatingDialog (book) {
      this.ratingDialog.book = book
      this.ratingDialog.title = 'Rating of book "' + book.title + '"'
      this.ratingDialog.visible = true
      this.ratingDialog.ratingLoading = true
      this.ratingDialog.rating = 0
      this.ajax.get('/books/' + book.id + '/rating').then(response => {
        if (response.code === '0') {
          this.ratingDialog.rating = response.info.rating
          this.ratingDialog.ratingLoading = false
        } else {
          this.ratingDialog.rating = 0
          this.ratingDialog.ratingLoading = false
        }
      })
    },
    closeRatingDialog () {
      this.ratingDialog.visible = false
    },
    async rate () {
      this.ratingDialog.ratingSubmitting = true
      await this.ajax.put('/books/' + this.ratingDialog.book.id + '/rating', {
        rating: this.ratingDialog.rating
      }).then(response => {
        this.ratingDialog.visible = false
        this.$notify({
          title: 'success',
          message: 'rated',
          type: 'success'
        })
      })
      this.ratingDialog.ratingSubmitting = false
    }
  }
}
</script>
