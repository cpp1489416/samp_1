<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import {debounce} from '@/utils'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    option: {
      default: null,
      type: Object
    }
  },
  watch: {
    option (val) {
      if (val === null) {
        return
      }
      debounce(() => {
        this.chart.setOption(val, true)
      }, 100)()
    },
    height (val) {
      var that = this
      debounce(() => {
        that.chart.resize()
      }, 100)()
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById(this.id))
    }
  }
}
</script>
