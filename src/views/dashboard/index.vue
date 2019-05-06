<template>
  <div class="dashboard-container">
    <div class="dashboard-text">username:{{ username }}</div>
    <div class="dashboard-text" v-loading="loading" v-html="status"></div>
    <div class="dashboard-text">
      <el-button type="primary" v-loading="regenerating" @click="regenerateSimilarity">Regenerate Similarity</el-button>
    </div>
    <div class="dashboard-text" v-if="regenerateInfo.cost_seconds !== null">
      cost seconds: {{regenerateInfo.cost_seconds}}
    </div>
    <div class="dashboard-text" v-if="regenerateInfo.size !== null">
      similarity size: {{regenerateInfo.size}}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'username',
      'roles'
    ])
  },
  data () {
    return {
      regenerating: false,
      regenerateInfo: {
        cost_seconds: null,
        size: null
      },
      loading: true,
      status: 'loading'
    }
  },
  methods: {
    async regenerateSimilarity () {
      this.regenerating = true
      await this.ajax.post('/recommendations/regenerate_similarity').then(response => {
        this.regenerateInfo = response.info
        this.$notify({
          message: 'regenerated',
          type: 'success'
        })
      })
      this.regenerating = false
    },
    async getStatus () {
      this.loading = true
      await this.ajax.get('/recommendations/status').then(response => {
        let status = 'similarity last cost seconds: ' + response.info.cost_seconds

        if (response.info.precision_generating) {
          status += '<br/> presision is generation'
        }
        if (response.info.recall_generating) {
          status += '<br/> recall is generation'
        }
        if (response.info.coverage_generating) {
          status += '<br/> coverage is generation'
        }
        this.status = status
      })
      this.loading = false
    }
  },
  mounted () {
    this.getStatus()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
