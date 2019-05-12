<template>
  <div :class="classObj" class="app-wrapper">
    <v-header class="header"/>
    <div v-if="device==='mobile'&&sidebar.opened&&!this.sidebarDisabled" class="drawer-bg" @click="handleClickOutside"/>
    <div :class="{'main-container': true, 'main-container-disable-sidebar': this.sidebarDisabled}">
      <sidebar :class="{'sidebar-container': true, 'sidebar-disable': this.sidebarDisabled}"/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import {Header, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    'v-header': Header,
    Sidebar,
    AppMain
  },
  watch: {
    $route() {
      this.sidebarDisabled = (this.$route.meta.sidebarHidden === true)
    }
  },
  data() {
    return {
      sidebarDisabled: this.$route.meta.sidebarHidden === true
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  },
  mounted() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  // @import "src/styles/mixin.scss";
  .app-wrapper {
    //@include clearfix;
    position: static;
    height: 100%; 
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
    .header {
      top: 0;
      position: fixed;  
      width: 100%;
      z-index: 100000;
    }
    .main-container {
      padding-top: 70px;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .main-container-disable-sidebar {
    margin-left: 0px !important;
    transition: margin-left .0s !important;
  }
  .sidebar-disable {
    display: none;
  }
</style>
