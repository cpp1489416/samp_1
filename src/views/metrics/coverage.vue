<template>
  <div class="app-container" id="app_container" style="position:relative">
    <div ref="filter_container" class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="dialog.visible = true" :disabled="dialog.loading">Regenerate</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="getCoverage">Refresh</el-button>
      <el-button class="filter-item" icon="el-icon-back" @click="$router.back()">Back</el-button>
    </div>
    <chart ref="chart" :height="chartHeight" width="100%" :option="option" v-loading="loading"/>
    <el-dialog
      :visible="dialog.visible"
      title="Please input k array to regenerate"
      :before-close="closeDialog">
      <el-form ref="form" :model="dialog" :rules="dialog.rules" auto-complete="on" label-position="left">
        <el-form-item prop="ks" style="margin: 0">
          <el-input
            auto-complete="on"
            :disabled="dialog.loading === true"
            name="ks"
            @keyup.enter.native="regenerate"
            v-model="dialog.ks">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="regenerate" :disabled="dialog.loading === true || dialog.invalidated === true">
          Regenerate
        </el-button>
        <el-button @click="dialog.visible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Chart from '@/components/Charts'

export default {
  components: { Chart },
  computed: {
    ...mapGetters([
      'username', 'user'
    ])
  },
  watch: {},
  data () {
    const validateKs = (rule, value, callback) => {
      try {
        JSON.parse(value)
        this.dialog.invalidated = false
        callback()
      } catch (e) {
        this.dialog.invalidated = true
        callback(new Error('k array must like "[1, 3, 5, 10, 20, 50, 100, 500, 1000]"'))
      }
    }
    return {
      chartHeight: '0px',
      option: null,
      loading: true,
      dialog: {
        visible: false,
        ks: '[1, 3, 5, 10, 20, 50, 100, 500, 1000]',
        loading: false,
        invalidated: false,
        rules: {
          ks: [{ required: true, trigger: 'change', validator: validateKs}]
        }
      },

      optionDefault: {
        backgroundColor: '#344b58',
        title: {
          text: 'coverage',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['coverage']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          name: 'k',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: [10, 30]
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        series: [
          {
            name: 'coverage',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter (p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: [
              0.3,
              0.032
            ]
          }
        ]
      }
    }
  },
  methods: {
    async getCoverage () {
      this.loading = true

      var that = this
      await this.ajax.get('/recommendations/coverage').then(response => {
        console.log(response.info)
        let ks = []
        let values = []
        for (const id in response.info) {
          ks.push(response.info[id].k)
          values.push(response.info[id].value)
        }
        console.log(ks)
        console.log(values)
        const option = Object.assign({}, this.optionDefault)
        option.xAxis[0].data = ks
        option.series[0].data = values
        that.option = option
      })
      this.loading = false
    },
    closeDialog () {
      this.dialog.visible = false
    },
    async regenerate () {
      this.dialog.loading = true
      const ks = JSON.parse(this.dialog.ks)
      console.log(ks)

      this.ajax.put('/recommendations/coverage', {
        ks: ks
      }).then(response => {
        this.dialog.loading = false
        this.getCoverage()
      })
      this.$notify({
        message: 'the request is sent',
        type: 'success'
      })
      this.closeDialog()
    }
  },
  mounted () {
    var that = this
    var resize = function () {
      that.chartHeight = 'calc(100% - ' + that.$refs.filter_container.offsetHeight + 'px)'
    }
    window.addEventListener('resize', resize)
    resize()
    this.getCoverage()
  }
}
</script>

<style scoped>
  .line {
    text-align: center;
  }

  .app-container {
    height: calc(100vh - 84px);
  }

  .filter-container {

    padding-bottom: 10px;
  }

  .chart-container {
    width: 100%;

    height: 100%;

  }
</style>
